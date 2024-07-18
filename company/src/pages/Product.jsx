import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import { Publish } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase";
import { updateProduct } from "../redux/apiCalls";
import {
  showSuccessToast,
  showErrorToast,
} from "../components/toastNotifications";

const sharedInputStyles = css`
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid #f0f0f3;
  background: #f0f0f3;
  margin-bottom: 10px;
  outline: none;
  &:focus {
    border: 2px solid gold;
  }
`;

const Container = styled.div`
  display: flex;
  padding: 20px;
  margin: auto;
  max-width: 1200px;
  background-color: #f8f9fa;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const InfoImg = styled.img`
  width: 60%;
  height: auto;
  object-fit: cover;
  margin-bottom: 10px;
`;

const InfoTitle = styled.h3`
  margin: 20px 0;
  color: #555;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  ${sharedInputStyles}
`;

const Textarea = styled.textarea`
  ${sharedInputStyles}
  height: 100px;
  resize: vertical;
`;

const Select = styled.select`
  ${sharedInputStyles}
`;

const Button = styled.button`
  padding: 10px;
  border: none;
  background-color: #0d6efd;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    background-color: #0b5ed7;
  }
`;

const CategoryContainer = styled.div`
  margin-bottom: 20px;
  gap: 10px;
  display: flex;
  flex-wrap: wrap;
`;

const ConsoleContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;

  label {
    display: flex;
    align-items: center;
    margin-right: 10px; /* Adjust the margin as needed */
  }
`;

export default function Product() {
  const location = useLocation();
  const productId = location.pathname.split("/")[2];
  const dispatch = useDispatch();
  const product = useSelector((state) =>
    state.product.products.find((p) => p._id === productId)
  );

  const [file, setFile] = useState(null);
  const [imgUrl, setImgUrl] = useState(product?.img || "");

  useEffect(() => {
    if (product) {
      setImgUrl(product.img);
    }
  }, [product]);

  const [formData, setFormData] = useState({
    title: product?.title || "",
    description: product?.description || "",
    price: product?.price || "",
    salePercentage: product?.salePercentage || "",
    onSale: product?.onSale || false,
    inStock: product?.inStock || false,
    category: product?.categories?.[0] || "",
    genre: product?.categories?.[1] || "",
    console: product?.console || [],
    type: product?.type || "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price,
        inStock: product.inStock,
        onSale: product.onSale,
        salePercentage: product.salePercentage,
        category: product.categories[0] || "",
        genre: product.categories[1] || "",
        console: product.console || [],
        type: product.type.join(","),
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, category: value });
  };

  const handleGenreChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, genre: value });
  };

  const handleConsoleChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        console: [...prev.console, value],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        console: prev.console.filter((console) => console !== value),
      }));
    }
  };

  const handleUpdateProduct = async () => {
    let imageUrl = imgUrl;

    if (file) {
      const storageRef = ref(
        getStorage(app),
        `products/${Date.now()}_${file.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            showErrorToast("Failed to upload image.");
            reject(error);
          },
          async () => {
            imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
            setImgUrl(imageUrl);
            resolve(imageUrl);
          }
        );
      });
    }

    const updatedProduct = {
      ...formData,
      img: imageUrl,
      price: parseFloat(formData.price),
      salePercentage: parseFloat(formData.salePercentage),
      inStock: formData.inStock,
      onSale: formData.onSale,
      categories: [formData.category, formData.genre],
      console: formData.console,
      type: formData.type.split(","),
    };

    const result = await updateProduct(productId, updatedProduct, dispatch);
    if (result.success) {
      showSuccessToast("Product updated successfully!");
    } else {
      showErrorToast("Product update failed.");
    }
  };

  return (
    <Container>
      <LeftSection>
        <Label htmlFor="title">Product Name</Label>
        <Input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleInputChange}
        />

        <Label htmlFor="description">Product Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        />

        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleInputChange}
        />

        <Label htmlFor="category">Category</Label>
        <CategoryContainer>
          <label>
            <input
              type="radio"
              name="category"
              value="VideoGames"
              checked={formData.category === "VideoGames"}
              onChange={handleCategoryChange}
            />{" "}
            Video Games
          </label>
          <label>
            <input
              type="radio"
              name="category"
              value="Movies"
              checked={formData.category === "Movies"}
              onChange={handleCategoryChange}
            />{" "}
            Movies
          </label>
          <label>
            <input
              type="radio"
              name="category"
              value="FanMerch"
              checked={formData.category === "FanMerch"}
              onChange={handleCategoryChange}
            />{" "}
            Fan Merch
          </label>
        </CategoryContainer>

        <Label htmlFor="genre">Genre</Label>
        <Input
          id="genre"
          name="genre"
          type="text"
          value={formData.genre}
          onChange={handleGenreChange}
        />

        <Label htmlFor="console">Console</Label>
        <ConsoleContainer>
          <label>
            <input
              type="checkbox"
              name="console"
              value="Playstation"
              checked={formData.console.includes("Playstation")}
              onChange={handleConsoleChange}
            />
            Playstation
          </label>
          <label>
            <input
              type="checkbox"
              name="console"
              value="Xbox"
              checked={formData.console.includes("Xbox")}
              onChange={handleConsoleChange}
            />
            Xbox
          </label>
          <label>
            <input
              type="checkbox"
              name="console"
              value="Nintendo"
              checked={formData.console.includes("Nintendo")}
              onChange={handleConsoleChange}
            />
            Nintendo
          </label>
          <label>
            <input
              type="checkbox"
              name="console"
              value="PC"
              checked={formData.console.includes("PC")}
              onChange={handleConsoleChange}
            />
            PC
          </label>
          <label>
            <input
              type="checkbox"
              name="console"
              value="NA"
              checked={formData.console.includes("NA")}
              onChange={handleConsoleChange}
            />
            N/A
          </label>
        </ConsoleContainer>

        <Label htmlFor="type">Type</Label>
        <Input
          id="type"
          name="type"
          type="text"
          value={formData.type}
          onChange={handleInputChange}
        />

        <Label htmlFor="inStock">In Stock</Label>
        <Select
          id="inStock"
          name="inStock"
          value={formData.inStock}
          onChange={handleInputChange}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </Select>

        <Label htmlFor="onSale">On Sale</Label>
        <Select
          id="onSale"
          name="onSale"
          value={formData.onSale}
          onChange={handleInputChange}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </Select>

        <Label htmlFor="salePercentage">Sale Percentage</Label>
        <Input
          id="salePercentage"
          name="salePercentage"
          type="number"
          value={formData.salePercentage}
          onChange={handleInputChange}
        />

        <Label htmlFor="file">
          <Publish /> Change Image
        </Label>
        <Input
          type="file"
          id="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </LeftSection>
      <RightSection>
        <InfoImg
          src={imgUrl || "default_image_path.jpg"}
          alt={formData.title}
        />
        <InfoTitle>{formData.title}</InfoTitle>
        <Button onClick={handleUpdateProduct}>Update Product</Button>
      </RightSection>
    </Container>
  );
}
