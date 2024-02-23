const { Request, Response } = require("express");
const localModel = require("../models/local").local;
const extractFieldsFromJSON = require("../utils/extractLocalFields").extractFieldsFromJSON;

const localController = {};
const {
  fetchGeocodingData,
  fetchPlaceDetails,
  encapsulateJsonInLocalData,
} = require("../utils/geocodingFunctions");
const geoapify = require("../controllers/config/geoapify.json");
const { local } = require("../models/local");

localController.getLocalDataView = (req, res) => {
  res.render("./Locals/getLocalDataView", { data: null });
};

localController.getLocalData = async (req, res, next) => {
  try {
    const query = req.query.local;

    const geocodingData = await fetchGeocodingData(query, geoapify.apikey);
    const place_id = geocodingData.features[0].properties.place_id;
    const placeDetails = await fetchPlaceDetails(place_id, geoapify.apikey);
    const returno = await encapsulateJsonInLocalData(
      placeDetails.features.slice(1)
    );

    res.render("./Locals/getlocalDataView", { data: returno });
  } catch (err) {
    console.error(err);
    res.status(500).render("error", {
      errorCode: 500,
      errorMessage: "Internal Server Error",
    });
  }
};

localController.getAllData = async (req, res, next) => {
  try {
    const pageSize = 4;
    const currentPage = parseInt(req.query.page) || 1;
    const totalItems = await localModel.countDocuments({ deleted: false });
    const totalPages = Math.ceil(totalItems / pageSize);

    const locals = await localModel
      .find({ deleted: false })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    res.render("./Locals/getAllDataView", {
      data: locals,
      currentPage,
      totalPages,
    });
  } catch (e) {
    res.status(500).render("error", {
      errorCode: 500,
      errorMessage: e.message,
    });
  }
};

localController.getAllDataFrontEnd = async (req, res, next) => {
  try {
    const locals = await localModel.find({ deleted: false });

    // Apply the extractFieldsFromJSON function to each object
    const processedLocals = locals.map((local) => {
      const processedLocal = extractFieldsFromJSON(local);
      processedLocal.id = local._id; // Adiciona o ID ao objeto
      return processedLocal;
    });

    res.json( processedLocals );
  } catch (e) {
    res.status(500).send(e.message);
  }
};

localController.getData = async (req, res, next) => {
  try {
    const local = await localModel.findOne({
      _id: req.params.id,
      deleted: false,
    });
    if (!local) {
      return res.status(404).render("error", {
        errorCode: 404,
        errorMessage: "Local not found",
      });
    }
    res.render("./Locals/getDataView", { data: local });
  } catch (e) {
    res
      .status(500)
      .render("error", { errorCode: 500, errorMessage: e.message });
  }
};

localController.getDataFrontEnd = async (req, res, next) => {
  try {
    const local = await localModel.findOne({
      _id: req.params.id,
      deleted: false,
    });
    if (!local) {
      return res.status(404).render("error", {
        errorCode: 404,
        errorMessage: "Local not found",
      });
    }
    processedLocal = extractFieldsFromJSON(local);
    processedLocal.id = local._id;
    res.json(processedLocal);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

localController.addPlacesView = (req, res) => {
  res.render("./Locals/addPlacesView");
};

localController.addPlaces = async (req, res, next) => {
  const jsonArray = JSON.parse(req.body.jsonData);
  console.log(typeof jsonArray);
  if (!Array.isArray(jsonArray)) {
    return res.status(400).render("error", {
      errorCode: 400,
      errorMessage: "Invalid JSON format. Please enter a valid JSON array.",
    });
  }

  try {
    for (const json of jsonArray) {
      try {
        var local = new localModel(json);
        var registration = json;

        if (await localModel.findOne({ registration })) {
          return res.status(400).render("error", {
            errorCode: 400,
            errorMessage: "Places already in db",
          });
        }

        await local.validate();
        await local.save();
      } catch (e) {
        console.error(e);
        return res.status(500).render("error", {
          errorCode: 500,
          errorMessage: e.message,
        });
      }
    }
  } catch (e) {
    console.error(e);
    return res.status(500).render("error", {
      errorCode: 500,
      errorMessage: e.message,
    });
  }

  res.redirect("/places/all");
};

localController.updateLocationPriceView = async (req, res, next) => {
  try {
    const LocalToUpdate = await localModel.findOne({
      _id: req.params.id,
      deleted: false,
    });
    if (!LocalToUpdate) {
      return res.status(404).json({ error: "Local not found" });
    }
    res.render("Locals/updateLocationPriceView", { Local: LocalToUpdate });
  } catch (error) {
    next(error);
  }
};

localController.updateLocationPrice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { price } = req.body;

    const local = await localModel.findOne({ _id: id, deleted: false });

    if (!local) {
      return res
        .status(404)
        .render({ errorCode: 404, errorMessage: "Location not found" });
    }

    local.price = parseFloat(price);
    await local.save();

    return res.redirect("/places/all");
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .render("error", { errorCode: 500, errorMessage: e.message });
  }
};

localController.createLocalPlaceView = (req, res) => {
  res.render("./Locals/createLocalPlaceView");
};

localController.createLocalPlace = async (req, res, next) => {
  try {
    const jsonData = JSON.parse(req.body.jsonData);

    const existingLocalPlace = await localModel.findOne({
      ...jsonData,
      deleted: false,
    });
    if (existingLocalPlace) {
      return res.status(400).render("error", {
        errorCode: 400,
        errorMessage: "Local place already exists",
      });
    }

    const newLocalPlace = new localModel({ ...jsonData, deleted: false });
    await newLocalPlace.validate();
    await newLocalPlace.save();

    return res.json({ message: "Local place created successfully" });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .render("error", { errorCode: 500, errorMessage: e.message });
  }
};

localController.updateLocalPlaceByIdView = async (req, res, next) => {
  try {
    const LocalToUpdate = await localModel.findOne({
      _id: req.params.id,
      deleted: false,
    });
    if (!LocalToUpdate) {
      return res.status(404).json({ error: "Local not found" });
    }
    res.render("./Locals/updateLocalPlaceByIdView", { local: LocalToUpdate });
  } catch (error) {
    next(error);
  }
};

localController.updateLocalPlaceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedLocalPlace = req.body;

    const result = await localModel.findOneAndUpdate(
      { _id: id, deleted: false },
      updatedLocalPlace,
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: "Local place not found" });
    }

    return res.json({
      message: "Local place updated successfully",
      data: result,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

localController.deleteLocalById = async (req, res, next) => {
  try {
    const LocalToDelete = await localModel.findOne({
      _id: req.params.id,
      deleted: false,
    });
    if (!LocalToDelete) {
      return res.status(404).json({ error: "Local not found" });
    }
    res.render("Locals/deleteLocal", { Local: LocalToDelete });
  } catch (error) {
    next(error);
  }
};

localController.handledeleteLocalPlaceById = async (req, res, next) => {
  try {
    const deletedLocal = await localModel.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { deleted: true }
    );

    if (!deletedLocal) {
      return res.status(404).json({ error: "Local not found" });
    }

    res.redirect("/places/all");
  } catch (e) {
    next(error);
  }
};

module.exports = localController;
