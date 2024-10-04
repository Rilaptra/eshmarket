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
          alert(
            data.message || "Payment verification failed. Please try again."
          );
        }
      } else {
        throw new Error("Payment verification failed");
      }
    } catch (error) {
      console.error("Error during payment verification:", error);
      alert("An error occurred during payment verification. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Trakteer Payment</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>
            Please complete your payment of Rp {price} for {productTitle} on
            Trakteer.
          </p>
          <TrakteerButton />
          <p className="mt-2">
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
