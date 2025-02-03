import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useAppStore } from "../store/appStore";

const WorldMap = () => {

  const { isExpanded, setIsExpanded } = useAppStore();

  const mapRef = useRef<HTMLDivElement>(null);

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
      // 为每个国家创建一个组
      const countries = svg
        .selectAll("g")
        .data(data.features)
        .enter()
        .append("g");

      // 绘制国家路径
      countries
        .append("path")
        .attr("class", function (d: any) {
          const highlightedCountries = ["China", "USA", "Australia", "Canada"];
          return highlightedCountries.includes(d.properties.name)
            ? "country highlighted"
            : "country";
        })
        .attr("d", path as any)
        .on("mouseover", function (event: any, d: any) {
          // 显示对应的标签
          d3.select(this.parentNode as any)
            .select(".country-label")
            .style("opacity", 1);
        })
        .on("mouseout", function (event: any, d: any) {
          // 隐藏标签
          d3.select(this.parentNode as any)
            .select(".country-label")
            .style("opacity", 0);
        })
        .on("click", function (event: any, d: any) {
          // 打印国家名称到控制台
          if (isExpanded === false) {
            setIsExpanded(true);
          }
          console.log(d);
          console.log(d.properties.name);

        });

      // 添加国家名称标签
      countries
        .append("text")
        .attr("class", "country-label")
        .attr("transform", function (d: any) {
          const centroid = path.centroid(d);
          return "translate(" + centroid + ")";
        })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text((d: any) => d.properties.name);
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
      `}</style>
      <div className="fixed inset-0 flex items-center justify-center" ref={mapRef}></div>
    </>
  );
};

export default WorldMap;
