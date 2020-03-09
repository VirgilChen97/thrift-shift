import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import {
  getBidInfoWithProduct,
  verifyBid,
  alterBuyerNotificationCount,
} from "../../utils/FirebaseDbUtils";
import {
  Grid,
  Badge,
  Button,
  ExpansionPanelActions
} from "@material-ui/core";
import { getUser, updateBidPrice, deleteBid } from "../../utils/FirebaseAuthUtils";
import { isBidRead } from "../../utils/FirebaseDbUtils";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: "red"
  },
  bid: {
    padding: 0
  },
  details: {
    padding: 0
  },
  expansionPanel: {
    width: "100%"
  }
}));

const BuyerBid = props => {
  const classes = useStyles();
  const [bid, setBid] = React.useState(null);

  const handleChange = () => {
    if (bid.status && bid.status === "Accepted") {
      verifyBid(props.bidId);
      alterBuyerNotificationCount(getUser().uid, false);
    }
    if (props.open === props.bidId) {
      props.setOpen(null);
    } else {
      props.setOpen(props.bidId);
    }
  };

  const handleDeleteBid = () => {
    deleteBid(props.bidId, bid.productId, bid.buyerId);
  }

  const handleChangeBid = () => {
    updateBidPrice(props.bidId, price); 
  }

  React.useEffect(() => {
    getBidInfoWithProduct(props.bidId, setBid);
  }, []);

  if (bid) {
    return (
      <Badge
        color="secondary"
        variant="dot"
        invisible={isBidRead(props.bidId)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
        className={classes.expansionPanel}
      >
        <ExpansionPanel
          expanded={props.bidId === props.open}
          onChange={handleChange}
          className={classes.expansionPanel}
        >
          <ExpansionPanelSummary
            // expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Grid container>
              <Grid item xs={8}>
                <Typography className={classes.heading}>
                  {bid.product.name}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography className={classes.secondaryHeading}>
                  {bid.status &&
                  (bid.status === "Accepted" || bid.status === "Verified")
                    ? "Accepted"
                    : "$" + bid.price}
                </Typography>
              </Grid>
            </Grid>
          </ExpansionPanelSummary>
          {<ExpansionPanelActions>
          <Button color='secondary' onClick={handleDeleteBid}>Delete Bid</Button>
          <Button color='primary' onClick={handleChangeBid}>Change Bid</Button>
        </ExpansionPanelActions>}
        </ExpansionPanel>
      </Badge>
    );
  } else {
    return null;
  }
};

export default BuyerBid;
