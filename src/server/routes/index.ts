import { Router } from "express";

import alert from './alert-route';
import data from './data-route';

export const router = Router();

router.use('/alert', alert);
router.use('/data', data);

export default router;