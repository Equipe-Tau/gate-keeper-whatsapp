import { Router } from "express";

import alert from './alert-route';

export const router = Router();

router.use('/alert', alert);

export default router;