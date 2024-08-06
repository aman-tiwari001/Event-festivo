import React, { useState } from "react";
import axios from "axios";
import "./ListingPage.css";
import toast from "react-hot-toast";

const ListingPage2 = () => {
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    ticket_price: "",
    images: [],
    category: "Movie",
    token_name: "",
    total_tickets: "",
    location: {
      address: "",
      city: "",
      state: "",
      country: "",
    },
  });
  const [previewImage, setPreviewImage] = useState([]);
  const [charCount, setCharCount] = useState(0);


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [locationField]: value,
        },
      });
    } else if (name === "token_name") {
      const alphanumericRegex = /^[a-z0-9]*$/i;
      if (alphanumericRegex.test(value) && value.length <= 12) {
        setFormData({ ...formData, [name]: value });
        setCharCount(value.length);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imagesArray = [];
    const previewsArray = [];
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        imagesArray.push(reader.result);
        previewsArray.push(reader.result);

        if (imagesArray.length === files.length) {
          setFormData({ ...formData, images: imagesArray });
          setPreviewImage(previewsArray);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.total_tickets <= 0) {
        toast.error("Total price must be greater than 0.");
        return;
      }
    
      if (formData.ticket_price <= 0) {
        toast.error("Number of tokens must be greater than 0.");
        return;
      }
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        "http://localhost:4000/api/user/list/event",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if(response.status === 200) {
        toast.success("Event Created successfully 🎉");
        navigate("/")
      }

    } catch (error) {
      console.error("Error listing event:", error);
      toast.error("Failed to list event");
    }
  };

  const handleKeyDown = (e) => {
    if (e.target.name === "token_name") {
      const alphanumericRegex = /^[a-z0-9]*$/i;
      if (!alphanumericRegex.test(e.key) && e.key.length === 1) {
        e.preventDefault();
      }
    }
  };
  

  return (
    <div className="listing-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="desc" value={formData.desc} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Ticket Price</label>
          <input
            type="number"
            name="ticket_price"
            value={formData.ticket_price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Image</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            onKeyDown={handleKeyDown}
            required
          />
          {previewImage &&
            previewImage.map((img, index) => (
              <div className="image-preview">
                <img src={img} alt="Selected" />
              </div>
            ))}
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="Movie">Movie</option>
            <option value="Concert">Concert</option>
            <option value="Festival">Festival</option>
            <option value="Sports">Sports</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
        <label>Token Name (max 12 characters, alphanumeric)</label>
          <input
            type="text"
            name="token_name"
            value={formData.token_name}
            onChange={handleChange}
            required
          />
           <div className={`${charCount<12 && charCount>0 ? "text-green-500" : "text-red-400"}`}>{charCount}/12</div>
        </div>
        <div className="form-group">
          <label>Total Tickets</label>
          <input
            type="number"
            name="total_tickets"
            value={formData.total_tickets}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location.address"
            placeholder="Address"
            value={formData.location.address}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location.city"
            placeholder="City"
            value={formData.location.city}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location.state"
            placeholder="State"
            value={formData.location.state}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location.country"
            placeholder="Country"
            value={formData.location.country}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" id="button">List Event</button>
      </form>
    </div>
  );
};

export default ListingPage2;
