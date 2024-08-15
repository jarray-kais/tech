import { useState } from "react";
import { createProduct } from "../API";
import { useMutation } from "@tanstack/react-query";
import BuckButton from "../components/BackButton/BackButton";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
    const [fileName, setFileName] = useState('');
    const navigate = useNavigate()

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

    const createMutation = useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            alert('Product created successfully');
            navigate('/productlist')
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
        createMutation.mutate({productData : formData });
    };
    console.log(formData)

  return (
    <div className="signup"  style={{marginTop : "50px" , marginBottom : "50px" }}>
       <div>
       <div>
        <BuckButton />
            <h2>Create Product </h2>
       </div>
              
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
  )
}

export default CreateProduct