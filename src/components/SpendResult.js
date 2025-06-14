import { Divider, List, ListItem, ListItemText } from "@mui/material";
import React from "react";

const style = {
  py: 0,
  width: "100%",
  maxWidth: 360,
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
  backgroundColor: "background.paper",
};

function SpendResult({ data }) {
  const spends = [
    {
      amount: 20,
      from: "Alice",
      to: "Bob",
    },
    {
      amount: 5,
      from: "John",
      to: "Alice",
    },
  ];

  // return spends.map((spend, index) => (
  //   <div key={index} style={{ marginBottom: "10px" }}>
  //     <span>
  //       {spend.amount} {spend.from} need to pay {spend.to}
  //     </span>
  //   </div>
  // ));
  return (
    <List sx={style}>
      {data.map((spend, index) => (
        <React.Fragment key={index}>
          <ListItem>
            <ListItemText
              primary={`₹ ${spend.amount.toFixed(2)} : ${
                spend.from
              } should pay ${spend.to}`}
            />
          </ListItem>
          <Divider component="li" />
        </React.Fragment>
      ))}
    </List>
  );
}

export default SpendResult;
