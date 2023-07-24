import { Box } from "@mui/material";
import errorPage from "./errorFound.png";

const NotFound = () => {
  return (
    <Box display="flex" justifyContent="center" alignContent="center">
      {/* <h1>Country Data Not Found</h1> */}
      <img src={errorPage} alt="" />
    </Box>
  );
};

export default NotFound;
