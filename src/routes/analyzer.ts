import express, { type Request, type Response, type NextFunction, type Router } from 'express';
import createError from 'http-errors';
import type { Mastra } from '@mastra/core/mastra';
import { mastra } from '@exploration/agent';
import { analyzeRequestSchema } from './schemas/analyze.js';

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
    const parseResult = analyzeRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({
            error: {
                status: 400,
                message: 'Invalid request body',
                details: parseResult.error.flatten()
            }
        });
    }

    const payload = parseResult.data;
    const messages: Array<{ role: 'user'; content: string }> = [
        { role: 'user', content: payload.input }
    ];
    if (payload.transactions?.length) {
        messages.push({
            role: 'user',
            content: `Transactions JSON:\n${JSON.stringify(payload.transactions, null, 2)}`
        });
    }
    if (payload.metadata) {
        messages.push({
            role: 'user',
            content: `Metadata:\n${JSON.stringify(payload.metadata, null, 2)}`
        });
    }

    const conversation = messages.length > 1 ? messages : payload.input;
    
    // Agent is built separately - using type assertion since types are available at runtime
    const response = await (agent as any).generate(conversation);
    res.json(response);
} catch (error: any) {
    // Pass error to error handler with proper status
    const httpError = error.status || error.statusCode ? error : createError(500, error.message || 'Internal server error');
    next(httpError);
}
});

export default router;
