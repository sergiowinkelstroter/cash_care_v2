"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

interface NavigationViewerProps {
  prefix: string;
  href: string;
}

interface NavigationViewerData {
  data?: NavigationViewerProps[];
}

export const NavigationViewer = ({ data }: NavigationViewerData) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={"/painel"}>Home</BreadcrumbLink>
        </BreadcrumbItem>
        {data &&
          data.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={item.href}>{item.prefix}</BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
