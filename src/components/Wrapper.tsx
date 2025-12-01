import { ApiError } from "@/utils/classes";
import InlineError from "./InlineError";

export const Wrapper = ({
  hasData = true,
  children,
  error,
  statusCode,
}: {
  hasData?: boolean;
  children?: React.ReactNode;
  error?: string;
  statusCode?: number;
}) => {
  if (hasData) {
    return <div className="grow overflow-auto">{children}</div>;
  } else {
    return (
      <div className="grow overflow-auto">
        <div className="w-full h-full flex justify-center items-center">
          {error ? (
            <InlineError statusCode={statusCode} title={error} />
          ) : (
            "No data found"
          )}
        </div>
      </div>
    );
  }
};
