import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Checkbox, Grid, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { getDatabase, ref, set, push, child } from "firebase/database";

const theme = createTheme({
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#006434", // Change the focus color here
          },
        },
        input: {
          "&.Mui-focused": {
            color: "#006434", // Change the text color on focus
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: "#006434", // Change the label color on focus
          },
        },
      },
    },
  },
});

export default function CrudProductModal({ action, data, open, handleClose }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    cost: "",
    price: "",
    amount_in_stock: "",
    multiOption: false,
    options: null,
  });

  useEffect(() => {
    const formattedOptions = Object.keys(data?.options || {}).map((key) => ({
      name: key,
      ...data.options[key],
    }));

    setFormData({
      name: data?.name,
      category: data?.category,
      cost: data?.cost,
      price: data?.price,
      amount_in_stock: data?.amount_in_stock,
      multiOption: data?.options ? true : false,
      options: formattedOptions || null,
    });
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  function handlesCheckBox() {
    setFormData((prevState) => ({
      ...prevState,
      multiOption: !formData?.multiOption,
    }));

    if (!formData?.multiOption === true) {
      setFormData((prevState) => ({
        ...prevState,
        options: [{ name: "", price: "", cost: "", amount_in_stock: "" }],
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        options: null,
      }));
    }
  }

  const handleChangeNumber = (e) => {
    const { name, value } = e.target;

    const isValidNumber = /^\d*\.?\d*$/.test(value);
    console.log(isValidNumber);
    if (isValidNumber) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: parseFloat(value),
      }));
    }
  };

  const addOption = () => {
    setFormData((prevState) => ({
      ...prevState,
      options: [
        ...prevState.options,
        { name: "", price: "", cost: "", amount_in_stock: "" },
      ],
    }));
  };

  const removeOption = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      options: prevState.options.filter((_, i) => i !== index),
    }));
  };

  const handleChangeOption = (index, key, value) => {
    if (key === "cost" || key === "price" || key === "amount_in_stock") {
      const isValidNumber = /^\d*\.?\d*$/.test(value);

      if (isValidNumber) {
        setFormData((prevState) => ({
          ...prevState,
          options: prevState.options.map((option, i) =>
            i === index ? { ...option, [key]: parseFloat(value) } : option
          ),
        }));
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        options: prevState.options.map((option, i) =>
          i === index ? { ...option, [key]: value } : option
        ),
      }));
    }
  };

  function handleSave() {
    const formDataToSubmit = {
      name: formData.name,
      category: formData.category,
    };

    if (formData.multiOption) {
      const originalOptions = formData.options
        .filter((option) => option.name)
        .reduce((acc, option) => {
          const { name, ...rest } = option;
          acc[name] = rest;
          return acc;
        }, {});

      formDataToSubmit.options = originalOptions;

      delete formDataToSubmit.cost;
      delete formDataToSubmit.price;
      delete formDataToSubmit.amount_in_stock;
    } else {
      formDataToSubmit.cost = formData.cost || "";
      formDataToSubmit.price = formData.price || "";
      formDataToSubmit.amount_in_stock = formData.amount_in_stock || "";
    }

    console.log(formDataToSubmit);

    if (formData.name && formData.category) {
      const db = getDatabase();

      // Get a key for a new Post.
      let newPostKey = push(child(ref(db), "items")).key;

      if (action === "edit") {
        newPostKey = data.id;
      }
      console.log(newPostKey);
      set(ref(db, "items/" + newPostKey), {
        ...formDataToSubmit,
      });

      if (action === "edit") {
        alert("Product Updated");
      } else {
        alert("Product Added");
      }
      handleClose();
    } else {
      alert("Name and Category is required");
    }
  }
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              maxWidth: 400,
              bgcolor: "background.paper",
              borderRadius: "1rem",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {action === "edit" && "Edit Product"}
              {action === "add" && "Add a Product"}
            </Typography>

            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <Grid container>
                <Typography style={{ width: "100%", marginBottom: ".2rem" }}>
                  Name
                </Typography>

                <TextField
                  sx={{ width: "100%" }}
                  id="name"
                  name="name"
                  variant="outlined"
                  value={formData?.name}
                  onChange={handleChange}
                  placeholder="Type here.."
                />

                <Typography style={{ width: "100%", marginBottom: ".2rem" }}>
                  Category
                </Typography>
                <TextField
                  sx={{ width: "100%" }}
                  id="outlined-basic"
                  variant="outlined"
                  name="category"
                  value={formData?.category}
                  onChange={handleChange}
                  placeholder="Type here.."
                />

                {formData?.multiOption === false && (
                  <>
                    <Typography
                      style={{ width: "100%", marginBottom: ".2rem" }}
                    >
                      Cost
                    </Typography>
                    <TextField
                      sx={{ width: "100%" }}
                      id="outlined-basic"
                      variant="outlined"
                      name="cost"
                      value={formData?.cost}
                      onChange={handleChangeNumber}
                      placeholder="Type here.."
                    />

                    <Typography
                      style={{ width: "100%", marginBottom: ".2rem" }}
                    >
                      Price
                    </Typography>

                    <TextField
                      sx={{ width: "100%" }}
                      id="outlined-basic"
                      variant="outlined"
                      name="price"
                      value={formData?.price}
                      onChange={handleChangeNumber}
                      placeholder="Type here.."
                    />

                    <Typography
                      style={{ width: "100%", marginBottom: ".2rem" }}
                    >
                      Total Stock
                    </Typography>
                    <TextField
                      sx={{ width: "100%" }}
                      id="outlined-basic"
                      variant="outlined"
                      name="amount_in_stock"
                      value={formData?.amount_in_stock}
                      onChange={handleChangeNumber}
                      placeholder="Type here.."
                    />
                  </>
                )}

                <Typography style={{ width: "100%", marginBottom: ".2rem" }}>
                  Multiple options ?{" "}
                  <Checkbox
                    checked={formData?.multiOption}
                    onClick={handlesCheckBox}
                  />
                </Typography>

                <div style={{ maxHeight: "300px", overflow: "scroll" }}>
                  <Grid container>
                    {formData?.multiOption === true && (
                      <>
                        {formData?.options?.map((optItem, index) => {
                          return (
                            <div key={index} style={{ width: "100%" }}>
                              <Typography
                                style={{ width: "100%", marginBottom: ".5rem" }}
                              >
                                Option {index + 1}
                              </Typography>

                              <Typography
                                style={{ width: "100%", marginBottom: ".2rem" }}
                              >
                                Name
                              </Typography>

                              <TextField
                                sx={{
                                  width: "100%",
                                }}
                                id="outlined-basic"
                                variant="outlined"
                                name="name"
                                value={optItem?.name}
                                onChange={(e) =>
                                  handleChangeOption(
                                    index,
                                    e.target.name,
                                    e.target.value
                                  )
                                }
                                placeholder="Type here.."
                              />

                              <Typography
                                style={{ width: "100%", marginBottom: ".2rem" }}
                              >
                                Cost
                              </Typography>
                              <TextField
                                sx={{ width: "100%" }}
                                id="outlined-basic"
                                variant="outlined"
                                name="cost"
                                value={optItem?.cost}
                                onChange={(e) =>
                                  handleChangeOption(
                                    index,
                                    e.target.name,
                                    e.target.value
                                  )
                                }
                                placeholder="Type Number here.."
                              />
                              <Typography
                                style={{ width: "100%", marginBottom: ".2rem" }}
                              >
                                Price
                              </Typography>
                              <TextField
                                sx={{ width: "100%" }}
                                id="outlined-basic"
                                variant="outlined"
                                name="price"
                                value={optItem?.price}
                                onChange={(e) =>
                                  handleChangeOption(
                                    index,
                                    e.target.name,
                                    e.target.value
                                  )
                                }
                                placeholder="Type Number here.."
                              />
                              <Typography
                                style={{ width: "100%", marginBottom: ".2rem" }}
                              >
                                Total Stock
                              </Typography>
                              <TextField
                                sx={{ width: "100%" }}
                                id="outlined-basic"
                                variant="outlined"
                                name="amount_in_stock"
                                value={optItem?.amount_in_stock}
                                onChange={(e) =>
                                  handleChangeOption(
                                    index,
                                    e.target.name,
                                    e.target.value
                                  )
                                }
                                placeholder="Type Number here.."
                              />

                              <Button
                                sx={{
                                  ":hover": { color: "#006434" },
                                  textTransform: "none",
                                  color: "white",
                                  width: "100%",
                                  borderRadius: "2rem",
                                  backgroundColor: "#006434",
                                  fontWeight: "600",
                                  marginTop: "1rem",
                                  marginBottom: "1rem",
                                }}
                                onClick={() => removeOption(index)}
                              >
                                Remove Option {index + 1}
                              </Button>
                            </div>
                          );
                        })}{" "}
                        <Button
                          sx={{
                            ":hover": { color: "#006434" },
                            textTransform: "none",
                            color: "white",
                            width: "100%",
                            borderRadius: "2rem",
                            backgroundColor: "#006434",
                            fontWeight: "600",

                            marginBottom: "1rem",
                          }}
                          onClick={addOption}
                        >
                          Add New Option
                        </Button>{" "}
                      </>
                    )}{" "}
                  </Grid>
                </div>
              </Grid>
            </Typography>
            <Button
              sx={{
                ":hover": { color: "#006434" },
                textTransform: "none",
                color: "#006434",
                width: "100%",
                borderRadius: "2rem",
                border: "2px solid #006434",

                fontWeight: "600",

                marginTop: "1rem",
              }}
              onClick={() => {
                handleSave();
              }}
            >
              {action === "edit" && "Save Changes"}
              {action === "add" && "Add Product"}
            </Button>
          </Box>
        </Modal>
      </ThemeProvider>
    </div>
  );
}
