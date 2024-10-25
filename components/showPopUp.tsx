import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import Image from "next/image";
import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


type PopUpType = "DEFAULT" | "SUCCESS" | "ERROR" | "WARNING";

interface ShowPopUpProps {
  type: PopUpType;
  title: string;
  message: string;
  image?: string;
  action?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const typeConfig: Record<
  PopUpType,
  { icon: React.ReactNode; color: string; dialogTitle: string }
> = {
  DEFAULT: {
    icon: <Info className="h-6 w-6" />,
    color: "text-blue-500",
    dialogTitle: "Information",
  },
  SUCCESS: {
    icon: <CheckCircle className="h-6 w-6" />,
    color: "text-green-500",
    dialogTitle: "Success",
  },
  ERROR: {
    icon: <XCircle className="h-6 w-6" />,
    color: "text-red-500",
    dialogTitle: "Error Occurred!",
  },
  WARNING: {
    icon: <AlertCircle className="h-6 w-6" />,
    color: "text-yellow-500",
    dialogTitle: "Warning",
  },
};

export const ShowPopUp: React.FC<ShowPopUpProps> = ({
  type,
  title,
  message,
  image,
  action,
  isOpen,
  onClose,
}) => {
  const { icon, color, dialogTitle } = typeConfig[type];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-800 rounded-lg max-w-[375px]">
        <DialogHeader>
          <DialogTitle className={`text-lg font-semibold ${color}`}>
            {dialogTitle}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-start bg-slate-300 dark:bg-slate-900 p-3 rounded-xl space-x-4">
            <div className={`mt-1 ${color}`}>{icon}</div>
            <div className="flex-1 space-y-2">
              <h4 className="text-base font-medium leading-none">{title}</h4>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
          </div>
          {image && (
            <div className="mt-2">
              <Image
                src={image}
                alt="Popup image"
                className="w-full rounded-md object-cover"
              />
            </div>
          )}
          {action && <div className="mt-4">{action}</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Example usage
export default function PopUpExample() {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClose = () => setIsOpen(false);

  const handleAction = () => {
    console.log("Action clicked");
    handleClose();
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Show Popup
      </button>
      <ShowPopUp
        type="SUCCESS"
        title="Operation Successful"
        message="Your action has been completed successfully."
        action={
          <button
            onClick={handleAction}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Close
          </button>
        }
        isOpen={isOpen}
        onClose={handleClose}
      />
    </div>
  );
}
