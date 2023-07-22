import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

const DeleteConfirmationModal = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Device</DialogTitle>
      <DialogContent>
        Are you sure you want to delete this device?
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="warning"
          sx={{ color: "black", bgcolor: "#FFD700" }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="success"
          sx={{ color: "white", bgcolor: "#4CAF50" }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
