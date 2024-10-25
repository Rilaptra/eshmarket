import Image from "next/image";

import DLIcon from "@/components/dl.svg";

interface DiamondLockProps {
  s: number;
  className?: string;
}

export default function DiamondLock({ s, className }: DiamondLockProps) {
  return (
    <Image
      src={DLIcon}
      alt="Diamond Lock"
      className={className}
      width={s}
      height={s}
    />
  );
}
