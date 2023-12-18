import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth";
import { BackendContext } from "../context/backend";
import { LedgerContext } from "../context/ledger";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Checkbox from '@mui/material/Checkbox';

const Create = () => {
  const { identity } = useContext(AuthContext);
  const { createExhibition } = useContext(BackendContext);
  const { getBalance, approve } = useContext(LedgerContext);
  const navigate = useNavigate();

  const [exhibitionName, setExhibitionName] = useState("");
  const [description, setDescription] = useState("");
  const [ticketImage, setTicketImage] = useState([]);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [artworkName, setArtworkName] = useState("");
  const [artworkDescription, setArtworkDescription] = useState("");
  const [artworkImage, setArtworkImage] = useState([]);
  const [artworkPrice, setArtworkPrice] = useState(0);
  const [onSale, setOnSale] = useState(false);

  const fileToBase64 = async (file, type) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const buff = e.target.result;
      console.log(buff);
      const arr = new Uint8Array(buff);
      console.log(arr);

      if (type === 'ticket') {
        setTicketImage(arr);
      } else {
        setArtworkImage(arr);
      }
    }
    reader.readAsArrayBuffer(file);
  }

  const onChangeExhibitionName = (e) => {
    setExhibitionName(e.target.value);
  };

  const onChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const onChangeTicketImage = (e) => {
    fileToBase64(e.target.files[0], 'ticket');
  };

  const onChangeTicketPrice = (e) => {
    setTicketPrice(e.target.value);
  };

  const onChangeArtworkName = (e) => {
    setArtworkName(e.target.value);
  }

  const onChangeArtworkDescription = (e) => {
    setArtworkDescription(e.target.value);
  }

  const onChangeArtworkImage = (e) => {
    fileToBase64(e.target.files[0], 'artwork');
  }

  const onChangeArtworkPrice = (e) => {
    setArtworkPrice(e.target.value);
  }

  const onChangeOnSale = (e) => {
    console.log(e.target.checked);
    setOnSale(e.target.checked);
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    const exhibition = {
      'name': exhibitionName,
      'description': description,
      'artworks': [
        {
          'name': artworkName,
          'description': artworkDescription,
          'image': artworkImage,
          'price': BigInt(artworkPrice),
          'onSale': onSale,
        }
      ],
      'ticketImage': ticketImage,
      'ticketPrice': BigInt(ticketPrice),
    }

    const balance = await getBalance();

    if (balance < BigInt(10)) {
      Swal.fire({
        title: "Insufficient Balance: " + balance.toString(),
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const approved = await approve(BigInt(10));
      if (!approved) {
        throw new Error("Error approving");
      }

      const resp = await createExhibition(exhibition);

      if (!resp) {
        throw new Error("Error creating exhibition");
      }

      Swal.fire({
        title: "Exhibition created: " + resp,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/");
      });
    } catch (err) {
      console.error('Error creating exhibition', err);
      Swal.fire({
        title: "Error creating exhibition",
        text: err.message,
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
  };

  useEffect(() => {
    if (!identity) {
      Swal.fire({
        title: "Login Required",
        icon: "error",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/");
      });
    }
  }, [identity]);

  if (!identity) {
    return (
      <div style={{ marginTop: "100px", color: "white" }}>
        <h1>Create</h1>
        <p>Loading...</p>
      </div>
    );
  }

  // {
  //   'name' : string,
  //   'description' : string,
  //   'artworks' : Array<
  //     {
  //       'name' : string,
  //       'description' : string,
  //       'image' : Uint8Array | number[],
  //       'price' : bigint,
  //       'onSale' : boolean,
  //     }
  //   >,
  //   'ticketImage' : Uint8Array | number[],
  //   'ticketPrice' : bigint,
  // },

  return (
    <Container component="main" maxWidth="xs" style={{ "marginTop": "120px" }}>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4">
          Create Exhibition
        </Typography>
        <Box component="form" sx={{ mt: 3 }} onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="exhibitionName"
                name="exhibitionName"
                required
                fullWidth
                id="exhibitionName"
                label="Exhibition Name"
                autoFocus
                onChange={onChangeExhibitionName}
                value={exhibitionName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="description"
                label="Description"
                name="description"
                autoComplete="description"
                rows={4}
                multiline
                onChange={onChangeDescription}
                value={description}
              />
            </Grid>
            <Grid direction="row" alignItems="center" justifyContent="center" spacing={2} item xs={12}>
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
              >
                <input hidden accept="image/*" type="file" onChange={onChangeTicketImage} />
                <PhotoCamera />
                <Typography component="h5" variant="h6">Ticket Image</Typography>
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="ticketPrice"
                label="Ticket Price"
                name="ticketPrice"
                autoComplete="ticketPrice"
                type='number'
                onChange={onChangeTicketPrice}
                value={ticketPrice}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography component="h5" variant="h5">Artworks</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="artworkName"
                label="Artwork Name"
                id="artworkName"
                autoComplete="artworkName"
                onChange={onChangeArtworkName}
                value={artworkName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="artworkDescription"
                label="Artwork Description"
                name="artworkDescription"
                autoComplete="artworkDescription"
                rows={4}
                multiline
                onChange={onChangeArtworkDescription}
                value={artworkDescription}
              />
            </Grid>
            <Grid direction="row" alignItems="center" justifyContent="center" spacing={2} item xs={12}>
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
              >
                <input hidden accept="image/*" type="file" onChange={onChangeArtworkImage} />
                <PhotoCamera />
                <Typography component="h5" variant="h6">Artwork Image</Typography>
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="artworkPrice"
                label="Artwork Price"
                name="artworkPrice"
                autoComplete="artworkPrice"
                type='number'
                onChange={onChangeArtworkPrice}
                value={artworkPrice}
              />
            </Grid>
            <Grid item xs={12}>
              <Checkbox
                color="primary"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
                required
                onChange={onChangeOnSale}
                value={onSale}
              />
              <Typography component="h5" variant="h6">On Sale</Typography>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Create;
