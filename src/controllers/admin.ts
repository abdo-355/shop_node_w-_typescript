import { RequestHandler } from "express";

import path from "path";
import Product from "../models/product";

export const getProducts: RequestHandler = (req, res, next) => {
  Product.fetchAll()!
    .then((products) => {
      res.render(path.join("admin", "products"), {
        prods: products,
        pageTitle: "Admin products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

export const getAddProduct: RequestHandler = (req, res, next) => {
  res.render(path.join("admin", "edit-product"), {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editMode: "false",
  });
};

export const postAddProduct: RequestHandler = (req, res, next) => {
  const { title, imgUrl, description, price } = req.body;

  const product = new Product(title, +price, imgUrl, description);

  product
    .save()!
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

export const getEditProduct: RequestHandler = (req, res, next) => {
  const editMode = req.query.edit;
  if (editMode !== "true") {
    return res.redirect("/");
  }
  const productId = req.params.productId;
  Product.findById(productId)!
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render(path.join("admin", "edit-product"), {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editMode,
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

export const postEditProduct: RequestHandler = (req, res, next) => {
  const productId = req.body.id;
  const updatedTitle = req.body.title;
  const updatedDescription = req.body.description;
  const updatedImg = req.body.imgUrl;
  const updatedPrice = req.body.price;
  Product.findByPk(productId)
    .then((product) => {
      if (!product) {
        return;
      }
      product.title = updatedTitle;
      product.description = updatedDescription;
      product.price = updatedPrice;
      product.imgUrl = updatedImg;
      return product.save();
    })
    .then((result) => {
      console.log("product updated");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

// export const postDeleteProduct: RequestHandler = (req, res, next) => {
//   const productId = req.body.productId;
//   Product.findByPk(productId)
//     .then((product) => {
//       return product!.destroy();
//     })
//     .then((result) => {
//       console.log("produc deleted");
//       res.redirect("/admin/products");
//     })
//     .catch((err) => console.log(err));
// };
