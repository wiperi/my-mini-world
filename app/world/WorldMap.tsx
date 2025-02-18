import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useAppStore } from "../store/appStore";
import { conversationHistory } from "../util/chatBot";
import Battery50Icon from "@mui/icons-material/Battery50";
import {
  boyImage,
  cottageImage,
  downhillSkiingImage,
  musicNoteImage,
} from "../assets";

let defaultAvatar = cottageImage.src;

// 首先定义类型
type AvatarPosition = {
  type: "center" | "city" | "coordinate";
  coordinates?: [number, number]; // 经纬度坐标
  cityName?: string;
};

type AvatarInfo = {
  id: string;
  countryName: string;
  avatar?: string; // 将 avatar 设为可选
  position: AvatarPosition;
  userMessage: string;
  pseudoMessage: string;
  promptingMessage: string;
};

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
    sendMessage,
  } = useAppStore();

  const mapRef = useRef<HTMLDivElement>(null);

  // 替换原来的 highlightedCountries 为新的 avatarInfos
  const avatarInfos: AvatarInfo[] = [
    {
      id: "zhengzhou-1",
      countryName: "China",
      avatar: cottageImage.src,
      position: { type: "coordinate", coordinates: [114.34, 30.57] },
      userMessage: "Tell me: tian's connection about Zhengzhou",
      pseudoMessage: "Tell me your connection about Zhengzhou.",
      promptingMessage: "Exploring Zhengzhou traditions",
    },
    {
      id: "usa-1",
      countryName: "USA",
      avatar: musicNoteImage.src,
      position: { type: "center" },
      userMessage: `## This is somoething your should know. 
      
      tian's connection about USA 

      About USA, I love its music and games.
      
      My favorite band Metallica is from here, and I once went to their concert in LA.
      
      My first guitar came from here, the classic Les Paul.
      
      During my free time, I usually practice playing "For Whom the Bell Tolls" and play CS2.
      .
      
      Now, rephase and tell me: tian's connection about USA`,
      pseudoMessage: "Tell me your connection about USA.",
      promptingMessage: "Exploring USA culture",
    },
    {
      id: "sydney-1",
      countryName: "Australia",
      avatar: boyImage.src,
      position: {
        type: "city",
        cityName: "Sydney",
      },
      userMessage: "Tell me: tian's connection about Sydney",
      pseudoMessage: "Tell me your connection about Sydney.",
      promptingMessage: "Exploring sydney landmarks and culture",
    },
    {
      id: "canada-1",
      countryName: "Canada",
      avatar: downhillSkiingImage.src,
      position: {
        type: "center",
      },
      userMessage: "Tell me: tian's connection about Canada",
      pseudoMessage: "Tell me your connection about Canada.",
      promptingMessage: "Exploring Canada culture and landmarks",
    },

    // ... 可以添加更多头像信息
  ];

  // 添加获取头像位置的辅助函数
  const getAvatarPosition = (
    position: AvatarPosition,
    feature: any,
    path: any,
    projection: any
  ): [number, number] => {
    switch (position.type) {
      case "center":
        return path.centroid(feature);
      case "city":
        // 这里需要一个城市坐标数据库，这里简化处理
        // 实际应用中你需要一个城市坐标的查找表
        const cityCoordinates = getCityCoordinates(position.cityName!);
        return projection(cityCoordinates);
      case "coordinate":
        return projection(position.coordinates!);
      default:
        return path.centroid(feature);
    }
  };

  // 城市坐标查找函数（示例）
  const getCityCoordinates = (cityName: string): [number, number] => {
    const cityCoords: Record<string, [number, number]> = {
      Beijing: [116.4074, 39.9042],
      Shanghai: [121.4737, 31.2304],
      Guangzhou: [113.2806, 23.1251],
      Sydney: [151.2093, -33.8688], // 添加悉尼的坐标
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

    // 添加 clipPath 定义
    svg
      .append("defs")
      .append("clipPath")
      .attr("id", "avatar-clip")
      .append("circle")
      .attr("r", 15);

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
          return avatarInfos.some(
            (info) => info.countryName === d.properties.name
          )
            ? "country highlighted"
            : "country";
        })
        .attr("d", path as any)
        .on("mouseover", function (event: any, d: any) {
          // 显示对应的标签
          labelLayer
            .select(`.country-label-${d.properties.name.replace(/\s+/g, "-")}`)
            .style("opacity", 1);
        })
        .on("mouseout", function (event: any, d: any) {
          // 隐藏标签
          labelLayer
            .select(`.country-label-${d.properties.name.replace(/\s+/g, "-")}`)
            .style("opacity", 0);
        })
        .on("click", function (event: any, d: any) {
          console.log(d);
          console.log(d.properties.name);
        });

      // 在中间层添加国家标签
      data.features.forEach((d: any) => {
        const centroid = path.centroid(d);
        if (centroid.length) {
          labelLayer
            .append("text")
            .attr(
              "class",
              `country-label country-label-${d.properties.name.replace(
                /\s+/g,
                "-"
              )}`
            )
            .attr("transform", `translate(${centroid})`)
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .text(d.properties.name);
        }
      });

      // 在顶层添加头像
      data.features.forEach((feature: any) => {
        const countryAvatars = avatarInfos.filter(
          (info) => info.countryName === feature.properties.name
        );

        countryAvatars.forEach((avatarInfo, index) => {
          const position = getAvatarPosition(
            avatarInfo.position,
            feature,
            path,
            projection
          );
          if (!position) return;

          // 计算偏移以避免重叠
          const offset =
            avatarInfo.position.type === "center"
              ? [-30 + index * 35, -30] // 中心点时水平排列
              : [0, 0]; // 其他位置不偏移

          const avatar = avatarLayer
            .append("g")
            .attr("class", "avatar-container")
            .attr(
              "transform",
              `translate(${position[0] + offset[0]}, ${
                position[1] + offset[1]
              })`
            );

          // 背景圆圈
          avatar
            .append("circle")
            .attr("r", 17)
            .attr("class", "avatar-circle")
            .style("cursor", "pointer")
            .style("fill", "#374151"); // deep gray

          // 图片容器，添加 clip-path
          avatar
            .append("g")
            .attr("clip-path", "url(#avatar-clip)") // 添加裁剪
            .append("image")
            .attr("x", -15)
            .attr("y", -15)
            .attr("width", 30)
            .attr("height", 30)
            .attr("xlink:href", avatarInfo.avatar || defaultAvatar)
            .style("cursor", "pointer")
            .on("click", async function (event: any) {
              event.stopPropagation();
              console.log(`Clicked avatar: ${avatarInfo.id}`);

              if (!isExpanded) {
                setIsExpanded(true);
              }

              await sendMessage(
                avatarInfo.userMessage,
                avatarInfo.pseudoMessage
              );
              // addMessage({
              //   content: avatarInfo.promptingMessage,
              //   isUser: false,
              //   timestamp: new Date(),
              //   isComplete: true,
              // });
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

    window.addEventListener("resize", handleResize);

    // 清理函数
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        .country {
          fill: #252931;
          stroke: #ffffff;
          stroke-width: 0.5px;
        }
        .country.highlighted {
          fill: #253b57;
        }
        .country:hover {
          fill: #87ceeb;
        }
        .country-label {
          font-family: Arial, sans-serif;
          font-size: 12px;
          fill: #ffffff;
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
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }

        // .avatar-container:hover {
        //   transform: scale(1.1);
        //   transition: transform 0.2s ease;
        // }
      `}</style>
      <div
        className="fixed inset-0 flex items-center justify-center"
        ref={mapRef}
      ></div>
    </>
  );
};

export default WorldMap;
