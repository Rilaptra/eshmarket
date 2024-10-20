import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TrakteerButton from "./TrakteerButton";
import { showToast } from "./toast";

interface TrakteerModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productTitle: string;
  price: number;
}

export default function TrakteerModal({
  isOpen,
  onClose,
  productId,
  productTitle,
  price,
}: TrakteerModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handlePaymentConfirmation() {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/trakteer?productId=${productId}`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          router.push(`/product/download/${productId}`);
        } else {
          showToast(
            false,
            data.message || "Payment verification failed. Please try again."
          );
        }
      } else {
        showToast(
          false,
          (await response.json()).message || "Payment verification failed."
        );
      }
    } catch (error) {
      console.log("Error during payment verification:", error);
      showToast(false, "Payment verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-100 dark:bg-slate-900 dark:text-slate-100 text-slate-900">
        <DialogHeader>
          <DialogTitle>Trakteer Payment</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>
            Please complete your payment of Rp
            <span className="font-bold">{price}</span> for &quot;{productTitle}
            &quot; on Trakteer.
          </p>
          <TrakteerButton className="my-3" />
          <p>
            After completing the payment, click the button below to verify your
            purchase.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={handlePaymentConfirmation} disabled={isLoading}>
            {isLoading ? "Verifying..." : "I have completed the payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
