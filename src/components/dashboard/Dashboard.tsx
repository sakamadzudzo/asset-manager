import { DashboardProps } from "@/utils/types";
import { Card, CardHeader, CardBody, Divider, Spacer } from "@heroui/react";

export const Dashboard = ({
  title = "Welcome",
  statistics,
  infos,
}: DashboardProps) => {
  return (
    <div className="grow overflow-auto px-5 pb-5">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {statistics?.length &&
          statistics.map((stat: (typeof statistics)[0], index) => (
            <Card
              className={`text-background p-4 rounded shadow-sm hover:shadow-md shadow-foreground ${
                stat.colors || ""
              }`}
            >
              <CardHeader className="text-3xl font-bold">
                {stat.statistic}
              </CardHeader>
              <CardBody>{stat.detail}</CardBody>
            </Card>
          ))}
      </div>
      {infos?.length &&
        infos?.map((info, index) => (
          <>
            <Card
              key={`info-${index}`}
              className="shadow-sm shadow-foreground hover:shadow-md hover:shadow-foreground border"
            >
              <CardHeader>
                <h2 className="font-semibold text-lg">{info.title}</h2>
              </CardHeader>
              <Divider />
              <CardBody>
                <ul className="list-disc ml-6">
                  {info.info?.length &&
                    info.info?.map((item, index) => (
                      <li key={`${info.title}-${index}`}>{item}</li>
                    ))}
                </ul>
              </CardBody>
            </Card>
            <Spacer x={4} y={4} />
          </>
        ))}
    </div>
  );
};
