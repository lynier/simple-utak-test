import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { ref, onValue, off } from "firebase/database";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
} from "@mui/material";

import "../menu/MenuIndex.css";
import CrudProductModal from "./modal/CrudProductModal";

function MenuIndex() {
  const [openModalObj, setOpenModalObj] = React.useState({
    action: null,
    data: null,
    open: false,
  });

  const [items, setItems] = useState([]);

  useEffect(() => {
    const itemsRef = ref(db, "items");

    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      const itemList = [];
      for (let id in data) {
        itemList.push({ id, ...data[id] });
      }
      setItems(itemList);
    });

    return () => {
      off(itemsRef);
    };
  }, []);

  return (
    <div>
      <h1
        style={{
          paddingTop: "2rem",
          paddingBottom: "2rem",
          marginBottom: "1rem",
          borderBottom: "solid 1px #eeeeee",
        }}
      >
        Restaurant Menu
        <Button
          onClick={() => {
            setOpenModalObj({ action: "add", data: null, open: true });
          }}
          sx={{
            ":hover": { color: "#006434" },
            textTransform: "none",
            color: "white",
            marginLeft: "1rem",
            borderRadius: "6rem",
            backgroundColor: "#006434",
            fontWeight: "600",
          }}
        >
          Add a Product
        </Button>
      </h1>
      <Grid
        container
        rowSpacing={4}
        columnSpacing={2}
        className="cardContainer"
      >
        {items.map((item, index) => (
          <Grid key={index} item xs={12} sm={4} md={2}>
            <Card
              sx={{
                padding: ".5rem",
                margin: ".5rem",
                height: "100%",

                boxShadow:
                  "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
                borderRadius: ".8rem",
              }}
            >
              <CardMedia
                // sx={{ height: 140 }}
                image="/static/images/cards/contemplative-reptile.jpg"
                title="green iguana"
              />
              <CardContent sx={{ height: "90%" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    paddingBottom: "1rem",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      fontSize: "1.5rem",
                      fontWeight: "600",
                      marginBottom: "1rem",
                    }}
                  >
                    {item.name}
                  </div>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        borderRadius: ".2rem",
                        backgroundColor: "#f9f9f9",
                        width: "fit-content",
                        fontWeight: "500",
                        fontSize: ".8rem",
                        padding: ".3rem",
                        marginBottom: "1rem",
                      }}
                    >
                      {item.category}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      paddingBottom: "1rem",
                      padding: ".5rem",
                      borderRadius: ".5rem",
                      maxHeight: "120px",
                      overflow: "scroll",
                    }}
                  >
                    {!item.options && (
                      <>
                        <div
                          style={{
                            width: "100%",
                            fontSize: ".9rem",
                            fontWeight: "500",
                            textAlign: "left",
                          }}
                        >
                          PRICE: ₱ {item.price.toFixed(2)}
                        </div>
                        <div
                          style={{
                            width: "100%",
                            fontSize: ".9rem",
                            fontWeight: "500",
                            marginBottom: "1rem",
                            textAlign: "left",
                          }}
                        >
                          COST: ₱ {item.cost.toFixed(2)}
                        </div>
                        <div
                          style={{
                            width: "100%",
                            fontSize: ".9rem",
                            fontWeight: "500",
                            marginBottom: "1rem",
                            textAlign: "left",
                          }}
                        >
                          <> TOTAL STOCKS: {item.amount_in_stock} </>
                        </div>
                      </>
                    )}

                    {item.options && (
                      <>
                        {Object.keys(item.options).map((option) => (
                          <div key={option}>
                            <div
                              style={{
                                textTransform: "uppercase",
                                width: "100%",
                                fontSize: "1rem",
                                fontWeight: "600",
                              }}
                            >
                              {option}
                            </div>
                            <div
                              style={{
                                width: "100%",
                                fontSize: ".9rem",
                                fontWeight: "500",
                                textAlign: "left",
                              }}
                            >
                              PRICE: ₱ {item.options[option].price.toFixed(2)}{" "}
                            </div>
                            <div
                              style={{
                                width: "100%",
                                fontSize: ".9rem",
                                fontWeight: "500",
                                textAlign: "left",
                                marginBottom: "1rem",
                              }}
                            >
                              COST: ₱ {item.options[option].cost.toFixed(2)}
                            </div>
                            <div
                              style={{
                                width: "100%",
                                fontSize: ".9rem",
                                fontWeight: "500",
                                textAlign: "left",
                                marginBottom: "1rem",
                              }}
                            >
                              {`TOTAL STOCKS: ${item.options[option].amount_in_stock}`}
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  <div style={{ flexGrow: "1" }}></div>
                  <Button
                    onClick={() => {
                      setOpenModalObj({
                        action: "edit",
                        data: item,
                        open: true,
                      });
                    }}
                    sx={{
                      ":hover": { color: "#006434" },
                      textTransform: "none",
                      color: "white",
                      width: "100%",
                      borderRadius: "2rem",
                      backgroundColor: "#006434",
                      fontWeight: "600",
                    }}
                  >
                    Edit Product
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Modals */}
      {openModalObj?.open && (
        <CrudProductModal
          action={openModalObj?.action}
          open={openModalObj?.open}
          handleClose={() =>
            setOpenModalObj({ action: null, data: null, open: false })
          }
          data={openModalObj?.data}
        />
      )}
    </div>
  );
}

export default MenuIndex;
