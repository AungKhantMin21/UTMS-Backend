exports.getCurrentUser = async (req, res, next) => {
    try {
        res.status(200).json({
            status: 'success',
            data: req.user
        });
    } catch (err) {
        next(err);
    }
}