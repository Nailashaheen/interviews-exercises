import React, { useEffect, useState } from "react";
import { Box, InputBase, makeStyles, Typography } from "@material-ui/core";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import LocationOnOutlinedIcon from "@material-ui/icons/LocationOnOutlined";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    margin: "5px 10px 10px",
    padding: "10px 15px",
    borderRadius: "30px",
    zIndex: 1,
    backgroundColor: "#FFFFFF",
  },
  search__panel: {
    display: "flex",
    alignItems: "center",
  },
  backButton: {
    width: "13%",
  },
  searchBox: {
    position: "relative",
    margin: "4px 0 10px",
    width: "87%",
  },
  input: {
    fontSize: "12px",
    backgroundColor: "#E9E9E9",
    borderRadius: "15px",
    padding: "18px 15px",
    paddingLeft: "50px",
    "&::placeholder": {
      opacity: "1",
      color: theme.palette.grey[100],
    },
  },
  searchIcon: {
    position: "absolute",
    left: "17px",
    top: "16px",
    zIndex: 2,
  },
  list: {
    paddingLeft: 20,
  },
  text: {
    fontSize: 18,
  },
  locationIcon: {
    marginRight: 10,
    color: "#777",
    display: "flex",
    alignItems: "center",
  },
  listItem: {
    margin: "28px 0",
    display: "flex",
    alignItems: "center",
  },

  loader: {
    minHeight: 400,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  notFound: {
    color: "#555",
    fontSize: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export const GET_LOCATIONS = gql`
  query getLocations($query: String!) {
    locations(
      where: { country: { _eq: Singapore }, name: { _iLike: $query } }
    ) {
      edges {
        country {
          id
          name_en
        }
        city {
          id
        }
        district {
          name_en
        }
      }
    }
  }
`;

export const SearchLocation = () => {
  let searchTimeOut: any;
  const classes = useStyles();
  const router = useRouter();

  const [searchKey, setSearchkey] = useState("");

  const goBack = () => {
    router.push("/search");
  };

  const { loading, error, data, refetch } = useQuery(GET_LOCATIONS, {
    variables: { query: `%${searchKey}%` },
  });

  useEffect(() => {
    return () => {
      clearTimeout(searchTimeOut);
    };
  }, [searchTimeOut]);

  const handleChange = (e: any) => {
    e.preventDefault();
    const value = e.target.value;

    clearTimeout(searchTimeOut);
    searchTimeOut = setTimeout(() => {
      setSearchkey(value);
      refetch();
    }, 400);
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.search__panel}>
        <Box className={classes.backButton}>
          <KeyboardBackspaceIcon onClick={goBack} fontSize={"large"} />
        </Box>
        <Box mb={5} className={classes.searchBox}>
          <Box className={classes.searchIcon}>
            <img src="/images/Homepage/SearchIcon.svg" alt="SearchIcon" />
          </Box>
          <InputBase
            classes={{ input: classes.input }}
            fullWidth
            placeholder="Where do you need space?"
            autoFocus
            onChange={handleChange}
          />
        </Box>
      </Box>
      <Box className={classes.list}>
        {data && data.locations && data.locations.edges.length ? (
          data.locations.edges.map((location, index) => {
            if (!location.district || !location.district.name_en) {
              return null;
            }
            return (
              <p key={index} className={classes.listItem}>
                <span className={classes.locationIcon}>
                  <LocationOnOutlinedIcon fontSize="large" />
                </span>
                <span className={classes.text}>
                  {location.district.name_en}
                </span>
              </p>
            );
          })
        ) : loading ? null : (
          <div className={classes.notFound}>
            <p>No Location Found</p>
          </div>
        )}
        {loading && (
          <div className={classes.loader}>
            <CircularProgress />
          </div>
        )}
      </Box>
    </Box>
  );
};
