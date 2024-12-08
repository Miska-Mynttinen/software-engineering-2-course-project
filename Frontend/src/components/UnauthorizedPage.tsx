// components/UnauthorizedPage.tsx
import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="h1" color="error" gutterBottom>
          403
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          You do not have permission to view this page.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
          sx={{ marginTop: 2 }}
        >
          Go to Login Page
        </Button>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage;
