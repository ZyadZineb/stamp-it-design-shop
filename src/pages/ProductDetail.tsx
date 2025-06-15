
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById } from "../data/products";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>{t("products.empty", "No product found.")}</p>
          <Link to="/products" className="btn-primary mt-4">
            {t("products.title", "Our Products")}
          </Link>
        </div>
      </div>
    );
  }

  const product = getProductById(id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-4">{t("products.empty", "No product found matching your query.")}</h1>
            <Button onClick={() => navigate("/products")}>{t("products.title", "Back to Products")}</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container-custom">
          <div className="mb-4">
            <Link to="/products" className="text-brand-blue hover:underline text-sm">
              &larr; {t("products.title", "Back to Products")}
            </Link>
          </div>
          <div className="flex flex-col md:flex-row gap-8 bg-white rounded-lg shadow-md p-6">
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-64 object-contain rounded mb-4 bg-gray-100"
              />
              <div className="text-center font-bold text-xl text-brand-blue mb-2">
                {t(`productNames.${product.id}`, product.name)}
              </div>
              <div className="text-lg text-gray-600 mb-3">{product.price} DHS</div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">
                {t(`productNames.${product.id}`, product.name)}
              </h2>
              <p className="text-gray-700 mb-6">{t(`productDescriptions.${product.id}`, product.description)}</p>
              <ul className="mb-4 text-gray-800 space-y-1">
                <li>
                  <strong>{t("brands." + product.brand, product.brand)}</strong> – {product.model}
                </li>
                <li>
                  <strong>{t("products.details.size", "Size")}:</strong> {product.size}
                </li>
                <li>
                  <strong>{t("products.details.lines", "Lines")}:</strong> {product.lines}
                </li>
                <li>
                  <strong>{t("products.details.inkColors", "Ink Colors")}:</strong> {product.inkColors.join(", ")}
                </li>
                <li>
                  <strong>{t("products.details.shape", "Shape")}:</strong> {t("shapes." + product.shape, product.shape)}
                </li>
              </ul>
              <Button>{t("cart.addToCart", "Add to cart")}</Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
