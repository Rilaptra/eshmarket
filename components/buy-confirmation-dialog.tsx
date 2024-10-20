import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Upload, Check } from "lucide-react";
import { showToast } from "./toast";
import LoadingBlue from "./loading-blue";
import { ShowPopUp } from "./showPopUp";

interface IUser {
  _id: string;
}

interface IProduct {
  _id: string;
  title: string;
  price: {
    dl: number;
  };
}

interface BuyConfirmationDialogProps {
  product: IProduct;
  isOpen: boolean;
  onClose: () => void;
}

export default function BuyConfirmationDialog({
  product,
  isOpen,
  onClose,
}: BuyConfirmationDialogProps) {
  const [step, setStep] = useState(1);
  const [screenrecord, setScreenrecord] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      // reject if the file size is > 25 MB
      if (event.target.files[0].size > 25 * 1024 * 1024) {
        setPopupOpen(true);
        return;
      }
      setScreenrecord(event.target.files[0]);
    }
  };

  const handleConfirmDonation = async () => {
    if (!screenrecord) {
      alert("Please upload a screen record before confirming.");
      return;
    }

    setIsLoading(true);
    const user: IUser = JSON.parse(localStorage.getItem("userInfo") || "");

    const formData = new FormData();
    formData.append("screenrecord", screenrecord);
    formData.append("productId", product._id);
    formData.append("userId", user._id);

    try {
      const response = await fetch(`/api/dl`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        onClose();
        showToast(
          true,
          "Video submitted successfully! Please wait for the admin to verify your purchase."
        );
      } else {
        throw new Error("Purchase failed");
      }
    } catch (error) {
      console.error("Error during purchase:", error);
      alert("An error occurred during the purchase. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    {
      title: "World Entry",
      description:
        'Go to the world named "RAZUDEPO" in Growtopia. Make sure you\'re in the correct world before proceeding.',
    },
    {
      title: "Diamond Lock Donation",
      description: `Find the donation box in the world. Donate ${
        product.price.dl
      } Diamond Lock${product.price.dl > 1 ? "s" : ""} to this box.`,
    },
    {
      title: "Open System Tab",
      description:
        "Locate and open the system tab on your game console. It should look similar to this image:",
      image:
        "https://i.ibb.co/qDHDRbq/1727595555257-Screenrecord-2024-09-29-14-32-40-20-aedbcaf2756c7788e53d6cbb3446304f.jpg", // Replace with actual image path
    },
    {
      title: "Take a Screen Record",
      description: "Record it when you donating.",
      action: (
        <div className="flex gap-3 p-4 dark:bg-slate-800 rounded-lg justify-between items-center text-red-500 bg-red-100">
          <AlertCircle className="w-20" />
          <span className="font-light text-sm">
            IMPORTANT: Ensure the system message is clearly visible. Make sure
            NO notifications (like YouTube, Discord, or other apps) are covering
            the system message. Only Growtopia&apos;s own system messages should
            be visible in the screenrecord.
          </span>
        </div>
      ),
    },
    {
      title: "Upload Screen Record",
      description:
        "Upload your clear screenrecord to this platform. Double-check that the image has been successfully uploaded.",
      action: (
        <div className="mt-4">
          <Label
            htmlFor="screenrecord"
            className="block text-sm font-medium dark:text-gray-300 text-gray-700"
          >
            Upload Screen Record
          </Label>
          <div className="flex gap-3 justify-between">
            <Input
              id="screenrecord"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="mt-1 cursor-pointer"
            />
            <Upload className="mt-3" />
          </div>
          {screenrecord && (
            <p className="mt-2 text-sm text-green-600 flex items-center">
              <Check className="w-4 h-4 mr-1" /> Screen Record uploaded
            </p>
          )}
        </div>
      ),
    },
  ];

  const currentStep = steps[step - 1];
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] rounded-xl overflow-y-auto bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <DialogHeader>
          <DialogTitle>How to Buy Using Diamond Lock</DialogTitle>
          <DialogDescription>
            Follow these steps to purchase {product.title}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 pb-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">
              Step {step}: {currentStep.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {currentStep.description}
            </p>
            {currentStep.image && (
              <Image
                src={currentStep.image}
                alt={`Step ${step} example`}
                width={300}
                height={200}
                className="rounded-md mb-2"
              />
            )}
            {currentStep.action}
            {/* Pop up appeared when the user upload file size > 20MB */}
            <ShowPopUp
              type="ERROR"
              title="File size too large"
              message="File size exceeds 25 MB. Please upload a smaller file!"
              isOpen={popupOpen}
              onClose={() => setPopupOpen(false)}
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between items-center">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Previous
            </Button>
          )}
          {step < steps.length ? (
            <Button variant="outline" onClick={() => setStep(step + 1)}>
              Next
            </Button>
          ) : (
            <Button
              onClick={handleConfirmDonation}
              disabled={isLoading || !screenrecord}
            >
              {isLoading ? (
                <LoadingBlue />
              ) : (
                "I have finished donating the Diamond Lock"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
