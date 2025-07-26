import { Divider, List, ListItem, ListItemText, Stack } from "@mui/material";
import React from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import Currency from "./Currency";
import { useApiState } from "@/context/ApiStateContext";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const style = {
  py: 0,
  width: "100%",
  maxWidth: 360,
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
  backgroundColor: "background.paper",
};

function ShowResultBox({ list }) {
  const { peopleMap } = useApiState();

  if (!list || list.length === 0) {
    return <Typography>No transactions to show</Typography>;
  }

  return (
    <List sx={style}>
      {list?.map((spend, index) => (
        <React.Fragment key={index}>
          <ListItem>
            <ListItemText
              primary={
                <Box component="span" sx={{ display: "inline" }}>
                  <Currency
                    amount={spend.amount}
                    rightLabel={` : ${
                      peopleMap[spend.from_person_id]
                    } should pay ${peopleMap[spend.to_person_id]}`}
                  />
                </Box>
              }
            />
          </ListItem>
          <Divider component="li" />
        </React.Fragment>
      ))}
    </List>
  );
}

function SpendResult({ data, people }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
      >
        <Tab label="Final Transactions" {...a11yProps(0)} />
        <Tab label="All Transactions" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <ShowResultBox list={data.optimizedTransactions || []} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ShowResultBox list={data.transactions || []} />
      </TabPanel>
    </Box>
  );
}

export default SpendResult;
