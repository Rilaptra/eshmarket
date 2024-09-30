import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
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
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setScreenshot(event.target.files[0]);
    }
  };

  const handleConfirmDonation = async () => {
    if (!screenshot) {
      alert("Please upload a screenshot before confirming.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("screenshot", screenshot);

    try {
      const response = await fetch(`/api/product/${product._id}/dl`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        onClose();
        router.push("/");
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
        "https://i.ibb.co/qDHDRbq/1727595555257-Screenshot-2024-09-29-14-32-40-20-aedbcaf2756c7788e53d6cbb3446304f.jpg", // Replace with actual image path
    },
    {
      title: "Take a Clear Screenshot",
      description: "Capture a screenshot of your game screen.",
      action: (
        <div className="flex gap-3 p-4 rounded-lg justify-between items-center text-red-500 bg-red-100">
          <AlertCircle className="w-20" />
          <span className="font-light text-sm">
            IMPORTANT: Ensure the system message is clearly visible. Make sure
            NO notifications (like YouTube, Discord, or other apps) are covering
            the system message. Only Growtopia&apos;s own system messages should
            be visible in the screenshot.
          </span>
        </div>
      ),
    },
    {
      title: "Upload Screenshot",
      description:
        "Upload your clear screenshot to this platform. Double-check that the image has been successfully uploaded.",
      action: (
        <div className="mt-4">
          <Label
            htmlFor="screenshot"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Screenshot
          </Label>
          <div className="flex gap-3 justify-between">
            <Input
              id="screenshot"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 cursor-pointer"
            />
            <Upload className="mt-3" />
          </div>
          {screenshot && (
            <p className="mt-2 text-sm text-green-600 flex items-center">
              <Check className="w-4 h-4 mr-1" /> Screenshot uploaded
            </p>
          )}
        </div>
      ),
    },
  ];

  const currentStep = steps[step - 1];
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto bg-white">
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
          </div>
        </div>
        <DialogFooter className="flex justify-between items-center">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Previous
            </Button>
          )}
          {step < steps.length ? (
            <Button onClick={() => setStep(step + 1)}>Next</Button>
          ) : (
            <Button
              onClick={handleConfirmDonation}
              disabled={isLoading || !screenshot}
            >
              {isLoading ? (
                <motion.div
                  className="w-5 h-5 border-t-2 border-blue-500 border-solid rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
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
