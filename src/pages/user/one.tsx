import { useUserById } from "@/hooks/useUsers";
import { getInitials, getUserFullname } from "@/utils/helpers";
import {
  Accordion,
  AccordionItem,
  Avatar,
  Button,
  Link,
  Spacer,
} from "@heroui/react";
import { useSearchParams } from "next/navigation";
import {
  IdentificationCardIcon,
  PencilSimpleLineIcon,
  PhoneIcon,
  ChalkboardTeacherIcon,
  CheckIcon,
  XIcon,
} from "@phosphor-icons/react";
import React from "react";
import { Role } from "@/utils/types";
import useToastError from "@/hooks/toasts/ToastError";

export default function OneUserPage({
  incrementLoading,
  decrementLoading,
}: {
  incrementLoading: () => void;
  decrementLoading: () => void;
}) {
  const searchParams = useSearchParams();
  const id: string | null = searchParams.get("id");
  const profile: string | null = searchParams.get("profile");
  const { user, isLoading, isError, errorMessage, statusCode } = useUserById(
    id!
  );
  const loadingRef = React.useRef(false);

  React.useEffect(() => {
    if (isLoading && !loadingRef.current) {
      incrementLoading();
      loadingRef.current = true;
    }
    if (!isLoading && loadingRef.current) {
      decrementLoading();
      loadingRef.current = false;
    }
  }, [isLoading, incrementLoading, decrementLoading]);

  const hasContactInfo: boolean = React.useMemo(() => {
    return !!(user?.email || user?.phone);
  }, [user]);

  const disabledKeys: string[] = React.useMemo(() => {
    let disabled: string[] = [];
    if (!hasContactInfo) {
      disabled.push("2");
    }
    return disabled;
  }, [hasContactInfo]);

  const XMark: React.ReactNode = <XIcon weight="thin" size={25} color="red" />;
  const CheckMark: React.ReactNode = (
    <CheckIcon weight="thin" size={25} color="green" />
  );

  React.useEffect(() => {
    if (isError) {
      useToastError({
        error: errorMessage || "",
        statusCode: statusCode || 500,
      });
    }
  }, [isError]);

  return (
    <div className="grow overflow-auto">
      <div aria-label="Page buttons" className="w-full flex justify-end gap-4">
        <Button
          as={Link}
          color="primary"
          endContent={<PencilSimpleLineIcon weight="thin" size={34} />}
          href={`/user/edit?id=${user?.id}`}
        >
          Edit
        </Button>
      </div>
      <Accordion
        isCompact={true}
        defaultExpandedKeys={["1"]}
        disabledKeys={disabledKeys}
      >
        <AccordionItem
          key="1"
          aria-label="Basic Information"
          title="Basic Information"
          subtitle="User's identity and personal details."
          startContent={<IdentificationCardIcon weight="thin" size={34} />}
        >
          <div className="w-full px-4 flex flex-col md:flex-row">
            <div className="w-full md:w-1/4 aspect-square flex justify-center items-start">
              <div className="w-full aspect-square">
                <Avatar
                  src={``}
                  color="primary"
                  className="cursor-pointer w-full h-full"
                >
                  {getInitials(user)}
                </Avatar>
              </div>
            </div>
            <div className="w-3/4 flex flex-col px-4">
              <div className="info-row">
                <div className="info-row-title">Full Name:</div>
                <div className="info-row-content">{getUserFullname(user)}</div>
              </div>
              <Spacer x={4} y={4} />
              <div className="info-row">
                <div className="info-row-title">Salutation:</div>
                <div className="info-row-content">{user?.salutation}</div>
              </div>
              <Spacer x={4} y={4} />
              <div className="info-row">
                <div className="info-row-title">First Name:</div>
                <div className="info-row-content">{user?.firstname}</div>
              </div>
              <Spacer x={4} y={4} />
              <div className="info-row">
                <div className="info-row-title">Other Names:</div>
                <div className="info-row-content">{user?.othernames}</div>
              </div>
              <Spacer x={4} y={4} />
              <div className="info-row">
                <div className="info-row-title">Last Name:</div>
                <div className="info-row-content">{user?.lastname}</div>
              </div>
              <Spacer x={4} y={4} />
              <div className="info-row">
                <div className="info-row-title">System ID:</div>
                <div className="info-row-content">{user?.id}</div>
              </div>
            </div>
          </div>
        </AccordionItem>
        <AccordionItem
          key="2"
          aria-label="Contact Details"
          title="Contact Details"
          subtitle="Channels for communication."
          startContent={<PhoneIcon weight="thin" size={34} />}
        >
          {user?.email && (
            <>
              <div className="info-row">
                <div className="info-row-title">E-mail:</div>
                <div className="info-row-content whitespace-pre-wrap">
                  <Link isExternal href={`mailto:${user?.email}`}>
                    {user?.email}
                  </Link>
                </div>
              </div>
              <Spacer x={4} y={4} />
            </>
          )}
          {user?.phone && (
            <>
              <div className="info-row">
                <div className="info-row-title">
                  {user?.phone ? "Cell 1" : "Cell"}
                </div>
                <div className="info-row-content">
                  <Link isExternal href={`tel:${user?.phone}`}>
                    {user?.phone}
                  </Link>
                </div>
              </div>
              <Spacer x={4} y={4} />
            </>
          )}
        </AccordionItem>
        <AccordionItem
          key="3"
          aria-label="Account Information"
          title="Account Information"
          subtitle="Information of the user account."
          startContent={<ChalkboardTeacherIcon weight="thin" size={34} />}
        >
          <div className="info-row">
            <div className="info-row-title">Username:</div>
            <div className="info-row-content">{user?.username}</div>
          </div>
          <Spacer x={4} y={4} />
          <div className="info-row">
            <div className="info-row-title">Roles:</div>
            <div className="info-row-content">
              <ul className="list-decimal list-inside">
                {user?.roles?.map((role: Role) => (
                  <li>{role}</li>
                ))}
              </ul>
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
