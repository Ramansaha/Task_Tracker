// Create one record
export const create = async (model, data) => {
    try {
        const result = await model.create(data);
        if (!result) {
            return { status: false, message: 'Data not created' };
        }
        return { status: true, data: result };
    } catch (err) {
        return { status: false, error: err };
    }
};

// Create many records (bulk insert)
export const createMany = async (model, dataArray) => {
    try {
        const result = await model.bulkCreate(dataArray, { returning: true });
        if (!result || result.length === 0) {
            return { status: false, message: 'Data not created' };
        }
        return { status: true, data: result };
    } catch (err) {
        return { status: false, error: err };
    }
};

// Find one record
export const getOne = async (model, where = {}, options = {}) => {
    try {
        const result = await model.findOne({
            where,
            ...options
        });
        if (!result) {
            return { status: false, message: 'No data found' };
        }
        return { status: true, data: result };
    } catch (err) {
        return { status: false, error: err };
    }
};

// Find many records
export const getMany = async (model, where = {}, options = {}) => {
    try {
        const result = await model.findAll({
            where,
            ...options
        });
        if (result.length === 0) {
            return { status: false, message: 'No data found' };
        }
        return { status: true, data: result };
    } catch (err) {
        return { status: false, error: err };
    }
};

// Update one record
export const updateOne = async (model, where, updateData, options = {}) => {
    try {
        const [updatedCount] = await model.update(updateData, {
            where,
            ...options
        });
        if (updatedCount === 0) {
            return { status: false, message: 'No data updated' };
        }
        // Fetch updated record
        const updated = await model.findOne({ where });
        return { status: true, data: updated };
    } catch (err) {
        return { status: false, error: err };
    }
};

// Delete one record
export const deleteOne = async (model, where) => {
    try {
        const deletedCount = await model.destroy({ where });
        if (deletedCount === 0) {
            return { status: false, message: 'No data deleted' };
        }
        return { status: true, data: { deletedCount } };
    } catch (err) {
        return { status: false, error: err };
    }
};

// Get paginated records with metadata
export const getManyPaginated = async (model, where = {}, options = {}) => {
    try {
        const page = Math.max(1, parseInt(options.page) || 1);
        const pageSize = Math.max(1, Math.min(100, parseInt(options.pageSize) || 10)); // Max 100 items per page
        const offset = (page - 1) * pageSize;
        
        const queryOptions = {
            where,
            limit: pageSize,
            offset: offset,
            order: options.order || [['createdAt', 'DESC']],
            ...(options.attributes && { attributes: options.attributes })
        };

        // Get total count and data in parallel for better performance
        const [totalItems, data] = await Promise.all([
            model.count({ where }),
            model.findAll(queryOptions)
        ]);

        const totalPages = Math.ceil(totalItems / pageSize);

        return {
            status: true,
            data: data,
            pagination: {
                currentPage: page,
                pageSize: pageSize,
                totalItems: totalItems,
                totalPages: totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        };
    } catch (err) {
        return { status: false, error: err };
    }
};

