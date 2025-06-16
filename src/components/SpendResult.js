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

function SpendResult({ data, people }) {
  // group name based on person_id
  let peopleMap = {};
  for (let obj of people) {
    peopleMap[obj.person_id] = obj.personName;
  }

  return (
    <List sx={style}>
      {data?.transactions?.map((spend, index) => (
        <React.Fragment key={index}>
          <ListItem>
            <ListItemText
              primary={`₹ ${spend.amount.toFixed(2)} : ${
                peopleMap[spend.from_person_id]
              } should pay ${peopleMap[spend.to_person_id]}`}
            />
          </ListItem>
          <Divider component="li" />
        </React.Fragment>
      ))}
    </List>
  );
}

export default SpendResult;
