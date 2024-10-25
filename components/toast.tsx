import { CheckCircle, XCircle } from "lucide-react";
import React from "react";

import { toast } from "@/hooks/use-toast";

export function showToast(success: boolean, message: string) {
  toast({
    variant: success ? "default" : "destructive",
    title: success ? "Success!" : "Error",
    description: message,
    className: "bg-white text-black",
    action: (
      <div className="flex items-center">
        {success ? (
          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500 mr-2" />
        )}
      </div>
    ),
  });
}
