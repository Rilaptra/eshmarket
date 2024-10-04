import Image from "next/image";
import { Button } from "@/components/ui/button";

const TrakteerButton = () => {
  return (
    <Button asChild variant="ghost" className="p-0 h-auto">
      <a
        href="https://trakteer.id/erzy/tip"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src="https://cdn.trakteer.id/images/embed/trbtn-red-1.png?date=18-11-2023"
          width={136}
          height={40}
          alt="Trakteer Saya"
        />
      </a>
    </Button>
  );
};

export default TrakteerButton;
