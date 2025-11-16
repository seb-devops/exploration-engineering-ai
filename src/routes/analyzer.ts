import express, { type Request, type Response, type NextFunction, type Router } from 'express';
import createError from 'http-errors';
import type { Mastra } from '@mastra/core/mastra';
import { mastra } from '@exploration/agent';

const router: Router = express.Router();

router.post('/', async function(req: Request, res: Response, next: NextFunction) {   
try {
    const mastraInstance: Mastra = mastra;
    const agent = mastraInstance.getAgent('financialAgent');
    if (!agent) {
        return res.status(404).json({ 
            error: {
                status: 404,
                message: 'Agent not found: financialAgent'
            }
        });
    }
    
    // Validate input
    if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({
            error: {
                status: 400,
                message: 'Invalid request body. Expected an object with "input" field.'
            }
        });
    }

    const input = req.body.input || req.body;
    
    // Agent is built separately - using type assertion since types are available at runtime
    const response = await (agent as any).generate(input);
    res.json(response);
} catch (error: any) {
    // Pass error to error handler with proper status
    const httpError = error.status || error.statusCode ? error : createError(500, error.message || 'Internal server error');
    next(httpError);
}
});

export default router;
