import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, DollarSign } from "lucide-react";
import * as HoverCard from "@radix-ui/react-hover-card";
import styled from "@emotion/styled";

interface ProductLinkProps {
  product: {
    _id: string;
    title: string;
    price: {
      dl: number;
      money: number;
    };
  };
  setIsSearchPopupOpen: (isOpen: boolean) => void;
}

const StyledLink = styled(motion.a)`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background-color: #f0f0f0;
  transition: background-color 0.3s ease;
  text-decoration: none;
  color: #333;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductTitle = styled.span`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const ProductPrice = styled.span`
  font-size: 0.875rem;
  color: #666;
`;

const ProductLink: React.FC<ProductLinkProps> = ({
  product,
  setIsSearchPopupOpen,
}) => {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        <Link href={`/product/buy/${product._id}`} passHref>
          <StyledLink
            onClick={() => setIsSearchPopupOpen(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ProductInfo>
              <ProductTitle>{product.title}</ProductTitle>
              <ProductPrice>
                <ShoppingCart
                  size={14}
                  style={{ marginRight: "4px", display: "inline" }}
                />
                DL: {product.price.dl} |{" "}
                <DollarSign
                  size={14}
                  style={{ marginRight: "4px", display: "inline" }}
                />
                Rp{product.price.money}
              </ProductPrice>
            </ProductInfo>
          </StyledLink>
        </Link>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content sideOffset={5}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "1rem",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3>{product.title}</h3>
            <p>Click to view product details and purchase options.</p>
          </motion.div>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
};

export default ProductLink;
