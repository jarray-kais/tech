import { Link, useParams } from "react-router-dom";
import { findproduct, updateProduct } from "../API";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import BuckButton from "../components/BackButton/BackButton";

const EditProduct = () => {
    const { id } = useParams();
    const queryClient = useQueryClient()
    const [fileName, setFileName] = useState('');
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        mainCategory: "",
        subCategory: "",
        brand: "",
        countInStock: 0,
        description: "",
        image: [], 
    });

    const {
        data: productdetail,
        // eslint-disable-next-line no-unused-vars
        isLoading: loadingproductdetails,
        // eslint-disable-next-line no-unused-vars
        error: errorproductdetails,
    } = useQuery({
        queryKey: ["productdetails", id],
        queryFn: () => findproduct(id),
        refetchOnWindowFocus: false,
        retry: 2,
        cacheTime: 10000,
        staleTime: 10000 * 60 * 5,
    });
   

    useEffect(() => {
        if (productdetail) {
            setFormData({
                name: productdetail.name || "",
                price: productdetail.price || "",
                mainCategory: productdetail.category?.main || "",
                subCategory: productdetail.category?.sub || "",
                brand: productdetail.brand || "",
                countInStock: productdetail.countInStock || 0,
                description: productdetail.description || "",
                image: [],
            });
        }
    }, [productdetail]);

    const updateMutation = useMutation({
        mutationFn: updateProduct,
        onSuccess: () => {
            alert('Product updated successfully');
            queryClient.invalidateQueries(["productdetail"]);
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
            alert(errorMessage);
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleChangeFile = (event) => {
        const { files } = event.target;
        if (files.length + formData.image.length > 5) {
            alert("You can upload a maximum of 5 images.");
            return;
        }
        setFormData((prevData) => ({
            ...prevData,
            image: [...prevData.image, ...Array.from(files)], 
           
        }));
        setFileName(Array.from(files).map(file => file.name).join(', '));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        updateMutation.mutate({ id, updatedData: formData });
    };
   

    return (
        <div className="signup" style={{marginTop : "50px" , marginBottom : "50px" }}>
        <div style={{display : "flex", alignItems : "center", justifyContent : "space-between"}}>
              <BuckButton />
            <h2>Update Product: {productdetail?.name}</h2>
            <Link to={`/${productdetail?._id}/promotion`} className="add-to-card-button" style={{textDecoration : "none"}} >
             Promotion
            </Link>
        </div>
        <div>
            {productdetail?.image.map((image)=>(
                    <img src={"/" + image.url} alt="img" />
                ))
            }
        </div>
           

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Price:</label>
                    <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Category (main):</label>
                    <input
                        type="text"
                        name="mainCategory"
                        value={formData.mainCategory}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Category (sub):</label>
                    <input
                        type="text"
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Brand:</label>
                    <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Count in Stock:</label>
                    <input
                        type="number"
                        name="countInStock"
                        value={formData.countInStock}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Product Images:</label>
                    <div className="file-input">
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            multiple
                            onChange={handleChangeFile}
                            required
                            id="file-image"
                            className="file"
                        />
                        <label htmlFor="file" className="file-label">
                            Choose Files
                        </label>
                        <span className="file-name">{fileName || 'No files chosen'}</span>
                    </div>
                </div>
                <div className="pay-action-buttons">
                     <button type="submit" className="primary">Update Product</button>
                </div>
               
            </form>
        </div>
    );
};

export default EditProduct;
