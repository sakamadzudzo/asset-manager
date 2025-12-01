import { ChangePassword } from "@/components/ChangePassword";
import { Card, CardBody, Tab, Tabs } from "@heroui/react";
import React from "react";

type SettingsPart = {
  key: "" | "PASSWORD" | "MENU";
  title: string;
  description: string;
  content?: React.ReactNode;
};

export default function Settings() {
  const sections: SettingsPart[] = [
    {
      key: "",
      title: "Pick one",
      description: "Pick a section to work on",
      content: <Default />,
    },
    {
      key: "PASSWORD",
      title: "Change Password",
      description: "Change your password here",
      content: <ChangePassword />,
    },
    {
      key: "MENU",
      title: "Menu Setup",
      description: "Set up the database driven menus",
    },
  ];

  return (
    <div className="flex grow px-2 overflow-hidden">
      <div className="flex-col h-full w-full overflow-auto pt-0.5 pb-2">
        <Tabs
          aria-label="settings-sections"
          isVertical={true}
          className="h-full"
          classNames={{ tabWrapper: "h-full" }}
        >
          {sections.map((section) => (
            <Tab
              key={section.key}
              title={section.title}
              className="w-full h-full"
            >
              {section.content && (
                <Card className="w-full h-full">
                  <CardBody className="w-full h-full">
                    {section.content}
                  </CardBody>
                </Card>
              )}
            </Tab>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

const Default = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      Pick a section to work on
    </div>
  );
};
