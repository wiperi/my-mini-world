import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useAppStore } from "../store/appStore";
import { conversationHistory } from "../util/chatBot";

// 首先定义类型
type AvatarPosition = {
  type: 'center' | 'city' | 'coordinate';
  coordinates?: [number, number]; // 经纬度坐标
  cityName?: string;
}

type AvatarInfo = {
  id: string;
  countryName: string;
  avatar: string;
  position: AvatarPosition;
  presetInfo?: string;
  navigationInfo?: string;
}

const WorldMap = () => {

  const { 
    isExpanded, 
    messages, 
    inputMessage,
    setIsExpanded,
    addMessage,
    updateLastMessage,
    setMessageComplete,
    setInputMessage,
    sendMessage
  } = useAppStore();

  const mapRef = useRef<HTMLDivElement>(null);

  // 替换原来的 highlightedCountries 为新的 avatarInfos
  const avatarInfos: AvatarInfo[] = [
    {
      id: 'china-1',
      countryName: 'China',
      avatar: '/avatars/china-user1.png',
      position: { type: 'center' },
      presetInfo: 'Tell me about Chinese culture',
      navigationInfo: 'Exploring Chinese traditions'
    },
    {
      id: 'china-2',
      countryName: 'China',
      avatar: '/avatars/china-user2.png',
      position: { 
        type: 'city',
        cityName: 'Beijing'
      },
      presetInfo: 'Tell me about Beijing',
      navigationInfo: 'Exploring Beijing landmarks'
    },
    {
      id: 'china-3',
      countryName: 'China',
      avatar: '/avatars/china-user3.png',
      position: { 
        type: 'center',
      },
      presetInfo: 'Tell me about Beijing',
      navigationInfo: 'Exploring Beijing landmarks'
    },
    {
      id: 'china-4',
      countryName: 'China',
      avatar: '/avatars/china-user4.png',
      position: { 
        type: 'coordinate',
        coordinates: [113.2806, 23.1251]
      },
      presetInfo: 'Tell me about Guangzhou',
      navigationInfo: 'Exploring Guangzhou landmarks'
    },
    {
      id: 'usa-1',
      countryName: 'USA',
      avatar: '/avatars/usa-user1.png',
      position: { type: 'center' },
      presetInfo: 'Tell me about American culture'
    },
    {
      id: 'usa-2',
      countryName: 'USA',
      avatar: '/avatars/usa-user2.png',
      position: { 
        type: 'coordinate',
        coordinates: [-122.4194, 37.7749] // San Francisco coordinates
      },
      presetInfo: 'Tell me about San Francisco'
    }
    // ... 可以添加更多头像信息
  ];

  // 添加获取头像位置的辅助函数
  const getAvatarPosition = (position: AvatarPosition, feature: any, path: any, projection: any): [number, number] => {
    switch (position.type) {
      case 'center':
        return path.centroid(feature);
      case 'city':
        // 这里需要一个城市坐标数据库，这里简化处理
        // 实际应用中你需要一个城市坐标的查找表
        const cityCoordinates = getCityCoordinates(position.cityName!);
        return projection(cityCoordinates);
      case 'coordinate':
        return projection(position.coordinates!);
      default:
        return path.centroid(feature);
    }
  };

  // 城市坐标查找函数（示例）
  const getCityCoordinates = (cityName: string): [number, number] => {
    const cityCoords: Record<string, [number, number]> = {
      'Beijing': [116.4074, 39.9042],
      'Shanghai': [121.4737, 31.2304],
      'Guangzhou': [113.2806, 23.1251],
      // ... 添加更多城市坐标
    };
    return cityCoords[cityName] || [0, 0];
  };

  // 添加绘制地图的函数
  const drawMap = () => {
    if (!mapRef.current) return;

    // 清除之前的SVG
    d3.select(mapRef.current).selectAll("svg").remove();

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Create an SVG element and set its width and height to match the window dimensions
    const svg = d3
      .select(mapRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Define a projection method for the map using the Natural Earth projection
    // Scale the projection based on the smaller dimension of the window
    // Translate the projection to center it in the middle of the window
    const projection = d3
      .geoNaturalEarth1()
      .scale(Math.min(width, height) * 0.3)
      .translate([width / 2, height / 2]);

    // Create a path generator function using the defined projection
    const path = d3.geoPath().projection(projection);

    // 加载世界地图数据
    d3.json(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
    ).then(function (data: any) {
      // 创建不同的图层组
      const mapLayer = svg.append("g").attr("class", "map-layer");
      const labelLayer = svg.append("g").attr("class", "label-layer");
      const avatarLayer = svg.append("g").attr("class", "avatar-layer");

      // 在底层绘制国家
      const countries = mapLayer
        .selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("class", function (d: any) {
          return avatarInfos.some(info => info.countryName === d.properties.name)
            ? "country highlighted"
            : "country";
        })
        .attr("d", path as any)
        .on("mouseover", function (event: any, d: any) {
          // 显示对应的标签
          labelLayer
            .select(`.country-label-${d.properties.name.replace(/\s+/g, '-')}`)
            .style("opacity", 1);
        })
        .on("mouseout", function (event: any, d: any) {
          // 隐藏标签
          labelLayer
            .select(`.country-label-${d.properties.name.replace(/\s+/g, '-')}`)
            .style("opacity", 0);
        })
        .on("click", function (event: any, d: any) {
          if (isExpanded === false) {
            setIsExpanded(true);
          }
          console.log(d);
          console.log(d.properties.name);
        });

      // 在中间层添加国家标签
      data.features.forEach((d: any) => {
        const centroid = path.centroid(d);
        if (centroid.length) {
          labelLayer
            .append("text")
            .attr("class", `country-label country-label-${d.properties.name.replace(/\s+/g, '-')}`)
            .attr("transform", `translate(${centroid})`)
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .text(d.properties.name);
        }
      });

      // 在顶层添加头像
      data.features.forEach((feature: any) => {
        const countryAvatars = avatarInfos.filter(
          info => info.countryName === feature.properties.name
        );

        countryAvatars.forEach((avatarInfo, index) => {
          const position = getAvatarPosition(avatarInfo.position, feature, path, projection);
          if (!position) return;

          // 计算偏移以避免重叠
          const offset = avatarInfo.position.type === 'center' 
            ? [-30 + (index * 35), -30] // 中心点时水平排列
            : [0, 0]; // 其他位置不偏移

          const avatar = avatarLayer
            .append("g")
            .attr("class", "avatar-container")
            .attr("transform", `translate(${position[0] + offset[0]}, ${position[1] + offset[1]})`);

          avatar
            .append("circle")
            .attr("r", 15)
            .attr("class", "avatar-circle")
            .style("cursor", "pointer");

          avatar
            .append("image")
            .attr("x", -12)
            .attr("y", -12)
            .attr("width", 24)
            .attr("height", 24)
            .attr("xlink:href", avatarInfo.avatar)
            .style("cursor", "pointer")
            .on("click", async function(event: any) {
              event.stopPropagation();
              console.log(`Clicked avatar: ${avatarInfo.id}`);

              if (!isExpanded) {
                setIsExpanded(true);
              }

              await sendMessage(avatarInfo.presetInfo || `Tell me about ${avatarInfo.countryName}`);
              addMessage({
                content: avatarInfo.navigationInfo || `Would you like to know more about ${avatarInfo.countryName}?`,
                isUser: false,
                timestamp: new Date(),
                isComplete: true
              });
            });
        });
      });
    });
  };

  useEffect(() => {
    // 初始绘制
    drawMap();

    // 添加窗口大小变化监听器
    const handleResize = () => {
      drawMap();
    };

    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        .country {
          fill: #d0d0d0;
          stroke: #ffffff;
          stroke-width: 0.5px;
        }
        .country.highlighted {
          fill: #add8e6; /* 浅蓝色 */
        }
        .country:hover {
          fill: #f53;
        }
        .country-label {
          font-family: Arial, sans-serif;
          font-size: 12px;
          fill: #333;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .country:hover + .country-label {
          opacity: 1;
        }
        .avatar-circle {
          fill: white;
          stroke: #2196f3;
          stroke-width: 2px;
        }

        .avatar-container {
          pointer-events: all;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
        }

        // .avatar-container:hover {
        //   transform: scale(1.1);
        //   transition: transform 0.2s ease;
        // }
      `}</style>
      <div className="fixed inset-0 flex items-center justify-center" ref={mapRef}></div>
    </>
  );
};

export default WorldMap;
