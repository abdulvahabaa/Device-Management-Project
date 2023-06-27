import Device from "../models/Devices.js";
import Engineer from "../models/Engineers.js";

export const createDevice = async (req, res) => {
  console.log("create device funcion called");
  console.log(req.body);
  try {
    const { engineer, deviceName, deviceNumber, internalNumber } = req.body;

    const newDevice = new Device({
      engineer,
      deviceName,
      deviceNumber,
      internalNumber,
    });
    await newDevice.save();

    const device = await Device.find()
      .populate("engineer", "-password")
      .sort("-createdAt")
      .lean();
    res.status(201).json(device);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const getFeedDevices = async (req, res) => {
  try {
    const device = await Device.find();
    res.status(200).json(device);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const getMaintenance = async (req, res) => {
  try {
    const device = await Device.find({ status: "maintenance" });
    res.status(200).json(device);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUnchecked = async (req, res) => {
  try {
    const device = await Device.find({ status: "false" });

    res.status(200).json(device);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const forwardToMaintanace = async (req, res) => {
  console.log("function called...");
  console.log(req.body);

  try {
    const { deviceId, mic, camera, sensor, review } = req.body;
    console.log(deviceId);
    const checks = { mic, camera, sensor, review };
    const device = await Device.findByIdAndUpdate(
      deviceId,
      { status: "maintenance", $push: { checks: checks } },
      { new: true }
    );

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }
    console.log(device);
    res.status(200).json(device);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const statusToDammage = async (req, res) => {
  console.log("function called...");
  console.log(req.body);

  try {
    const { deviceId } = req.body;
    console.log(deviceId);

    const device = await Device.findByIdAndUpdate(
      deviceId,
      { status: "dammage" },
      { new: true }
    );

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }
    console.log(device);
    res.status(200).json(device);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const statusToProduction = async (req, res) => {
  console.log("function called...");
  console.log(req.body);

  try {
    const { deviceId } = req.body;
    console.log(deviceId);

    const device = await Device.findByIdAndUpdate(
      deviceId,
      { status: "production" },
      { new: true }
    );

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }
    console.log(device);
    res.status(200).json(device);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getLive = async (req, res) => {
  try {
    const device = await Device.find({ status: "Live" });
    res.status(200).json(device);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const statusToLive = async (req, res) => {
  console.log("function called...");
  console.log(req.body);

  try {
    const { deviceId } = req.body;
    console.log(deviceId);

    const device = await Device.findByIdAndUpdate(
      deviceId,
      { status: "Live" },
      { new: true }
    );

    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }
    console.log(device);
    res.status(200).json(device);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProduction = async (req, res) => {
  try {
    const device = await Device.find({ status: "production" });
    res.status(200).json(device);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getEngineerDevices = async (req, res) => {
  try {
    const { engineerId } = req.params;
    const device = await Device.find({ engineerId });
    res.status(200).json(device);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updateDevice = async (req, res) => {
  try {
    const { deviceId, deviceName, deviceNumber, internalNumber } = req.body;

    const updateDevice= await Device.findByIdAndUpdate(deviceId, {
      deviceName: deviceName,
      deviceNumber: deviceNumber,
      internalNumber: internalNumber,
    });

    console.log(updateDevice)

    res.status(200).json({ message: "Device updated successfully" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


export const deleteDevice = async (req, res) => {
  console.log("<<<>>>>>><<<<<<>>>>>")
  console.log(req.params)
  try {
    const { id } = req.params;
    const device = await Device.findByIdAndDelete(id);

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    return res.status(200).json({ message: 'Device deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};