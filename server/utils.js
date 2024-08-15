import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const baseUrl = () =>
  process.env.BASE_URL
    ? process.env.BASE_URL
    : process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : "https://yourdomain.com";

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      Country: user.Country,
      telephone: user.telephone,
      isAdmin: user.isAdmin,
      isSeller: user.isSeller,
      seller :{
        Address : user.seller?.Address, 
     logo : user.seller?.logo, 
     description : user.seller?.description,
     nameBrand : user.seller?.nameBrand,
     rating : user.seller?.rating,
     numReviews : user.seller?.numReviews,
     },
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "12h",
    }
  );
};

export const isAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      res.status(401).send({ message: "Invalid Token" });
    } else {
      req.user = decode;
      next();
    }
  });
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    console.log(req.user);
    next();
  } else {
    res.status(401).send({ message: "Invalid Admin Token" });
  }
};

export const isSeller = (req, res, next) => {
  if (req.user && req.user.isSeller) {
    next();
  } else {
    res.status(401).send({ message: "Invalid Seller Token" });
  }
};
export const isSellerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.isSeller || req.user.isAdmin)) {
    next();
  } else {
    res.status(401).send({ message: "Invalid Admin/Seller Token" });
  }
};
