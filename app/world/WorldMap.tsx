'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const WorldMap = () => {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        // 清除之前的SVG
        d3.select(mapRef.current).selectAll("svg").remove();

        const width = 960;
        const height = 500;

        const svg = d3.select(mapRef.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const projection = d3.geoNaturalEarth1()
            .scale(150)
            .translate([width / 2, height / 2]);

        const path = d3.geoPath()
            .projection(projection);

        // 加载世界地图数据
        d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
            .then(function(data: any) {
                // 为每个国家创建一个组
                const countries = svg.selectAll("g")
                    .data(data.features)
                    .enter()
                    .append("g");

                // 绘制国家路径
                countries.append("path")
                    .attr("class", "country")
                    .attr("d", path)
                    .on("mouseover", function(event, d) {
                        // 显示对应的标签
                        d3.select(this.parentNode)
                            .select(".country-label")
                            .style("opacity", 1);
                    })
                    .on("mouseout", function(event, d) {
                        // 隐藏标签
                        d3.select(this.parentNode)
                            .select(".country-label")
                            .style("opacity", 0);
                    });

                // 添加国家名称标签
                countries.append("text")
                    .attr("class", "country-label")
                    .attr("transform", function(d) {
                        const centroid = path.centroid(d);
                        return "translate(" + centroid + ")";
                    })
                    .attr("dy", ".35em")
                    .style("text-anchor", "middle")
                    .text((d: any) => d.properties.name);
            });
    }, []);

    return (
        <>
            <style jsx global>{`
                .country {
                    fill: #d0d0d0;
                    stroke: #ffffff;
                    stroke-width: 0.5px;
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
            <div ref={mapRef}></div>
        </>
    );
};

export default WorldMap; 