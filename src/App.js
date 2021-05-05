import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseLine from '@material-ui/core/CssBaseline';
import { useState } from 'react';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: "center"
  },
  content: {
    paddingTop: theme.spacing(4)
  }
}))

function App() {
  const classes = useStyles();
  const [src, setSrc] = useState('');
  const [result, setResult] = useState({ tgt: "" });

  const handleTranslate = async () => {
    if (!src) {
      return
    }
    try {

      async function recycling(prevResult) {
        const response = await axios.post("http://0.0.0.0:5000/translator/translate", [{
          src: prevResult.tgt,
          id: 100
        }])

        const result = response.data?.[0]?.[0] ?? { tgt: "", pred_score: -100 };

        if (prevResult.pred_score >= result.pred_score) {
          return prevResult
        } else {
          return await recycling(result)
        }
      }

      const result = await recycling({ tgt: src, pred_score: -100 })

      setResult(result)

    } catch (e) {
      console.log(e.message)
    }
  }
  return (<>
    <CssBaseLine />
    <AppBar position="static">
      <Toolbar>

        <Typography variant="h6" className={classes.title}>
          Sistem Intelejen
    </Typography>

      </Toolbar>
    </AppBar>
    <Container className={classes.content} maxWidth="md">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography className={classes.title} component="h1" variant="h4">Koreksi Teks Bahasa Indonesia dengan NMT</Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="Teks Input"
            multiline
            rows={8}
            value={src}
            onChange={(e) => {
              setSrc(e.target.value)
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Teks Output"
            variant="outlined"
            multiline
            rows={8}
            value={result.tgt}
            helperText={`Prediction Score: ${result.pred_score ?? ''} `}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid container item xs={12} justify="center">
          <Button onClick={handleTranslate} variant="contained" color="primary">Koreksi</Button>
        </Grid>
      </Grid>
    </Container>
  </>
  );
}

export default App;
