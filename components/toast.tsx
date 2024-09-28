import React from "react";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";

export function showToast(success: boolean, message: string) {
  //   const { toast } = useToast();

  toast({
    variant: success ? "default" : "destructive",
    title: success ? "Success!" : "Error",
    description: message,
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
