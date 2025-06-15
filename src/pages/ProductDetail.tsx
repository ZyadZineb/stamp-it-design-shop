
import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById } from "../data/products";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useCart } from "../contexts/CartContext";

const infoTagClass =
  "inline-block rounded-full bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 mr-2 mb-2 border border-blue-200";
const infoTagRedClass =
  "inline-block rounded-full bg-red-50 text-red-600 text-xs font-semibold px-3 py-1 mr-2 mb-2 border border-red-200";
const infoTagGrayClass =
  "inline-block rounded-full bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 mr-2 mb-2 border border-gray-300";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 via-white to-red-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md mx-auto">
          <p className="text-xl mb-6">{t("products.empty", "No product found.")}</p>
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
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-brand-blue/10 via-white to-brand-red/10">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-red-100 animate-fade-in">
            <h1 className="text-3xl font-extrabold mb-3 text-red-600">{t("products.empty", "No product found matching your query.")}</h1>
            <Button onClick={() => navigate("/products")}>{t("products.title", "Back to Products")}</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Handlers
  const handleAddToCart = () => {
    addToCart(product);
  };
  const goToStampDesigner = () => {
    navigate(`/design?productId=${product.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow py-8 bg-gradient-to-bl from-brand-blue/5 via-gray-50 to-brand-red/10 ">
        <div className="container-custom animate-fade-in">
          <div className="mb-4">
            <Link to="/products" className="text-brand-blue hover:underline text-sm font-medium">
              &larr; {t("products.title", "Back to Products")}
            </Link>
          </div>
          <div className="bg-white flex flex-col md:flex-row gap-12 rounded-2xl shadow-xl p-8 border border-gray-100 transition-[box-shadow] duration-300 hover:shadow-2xl">
            {/* Left: Image + Highlights */}
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
              <div className="relative w-full rounded-xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center mb-6 h-80">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-auto h-64 object-contain transition-transform duration-300 hover:scale-105"
                  style={{ maxWidth: "100%" }}
                />
                {/* Bordered ribbon */}
                <div className="absolute left-0 top-0">
                  <span className={infoTagRedClass}>{t(`brands.${product.brand}`, product.brand)}</span>
                </div>
              </div>
              {/* Product Title & Price */}
              <h1 className="text-2xl md:text-3xl font-extrabold text-brand-blue mb-2 text-center md:text-left">
                {t(`productNames.${product.id}`, product.name)}
              </h1>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-lg md:text-xl font-bold text-green-600 bg-green-50 rounded-md px-4 py-1">{product.price} DHS</span>
              </div>
              {/* Quick details */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={infoTagClass}>{product.model}</span>
                <span className={infoTagGrayClass}>{t("products.details.shape", "Shape")}: {t("shapes." + product.shape, product.shape)}</span>
                <span className={infoTagGrayClass}>{t("products.details.size", "Size")}: {product.size}</span>
                <span className={infoTagGrayClass}>{t("products.details.lines", "Lines")}: {product.lines}</span>
              </div>
            </div>
            {/* Right: Description & Actions */}
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              {/* Description */}
              <h2 className="text-lg text-brand-blue font-semibold mb-1">{t("products.details.about", "About this product")}</h2>
              <p className="text-gray-700 mb-6 italic">{t(`productDescriptions.${product.id}`, product.description)}</p>
              {/* Available ink colors */}
              <div className="mb-4 flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm text-gray-600">{t("products.details.inkColors", "Ink Colors")}:</span>
                {product.inkColors.map((color) => (
                  <span
                    key={color}
                    className="w-6 h-6 rounded-full inline-block border-2 border-gray-300 mr-1"
                    style={{
                      background:
                        color === "black"
                          ? "#222"
                          : color === "blue"
                          ? "#2563eb"
                          : color === "red"
                          ? "#e30613"
                          : color === "green"
                          ? "#22c55e"
                          : "#eee",
                    }}
                    title={t(`colors.${color}`, color)}
                  ></span>
                ))}
              </div>
              {/* Full details as chips */}
              <div className="mb-6 flex flex-wrap gap-2">
                {/* Brand as a tag (already in left ribbon, but show here for consistency on mobile) */}
                <span className="md:hidden">{t(`brands.${product.brand}`, product.brand)}</span>
                {/* Model, Shape, Size, Lines, etc. */}
                {/* Already shown above; repeat only if you want extra details */}
              </div>
              {/* Action buttons */}
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button onClick={handleAddToCart} className="w-full sm:w-auto shadow hover-scale">
                  {t("cart.addToCart", "Add to cart")}
                </Button>
                <Button
                  onClick={goToStampDesigner}
                  variant="outline"
                  className="w-full sm:w-auto border-brand-blue text-brand-blue font-semibold hover:bg-brand-blue/10 hover:border-brand-blue hover:scale-105 transition"
                >
                  {t("design.productDetail", "Design and Personalize")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;

