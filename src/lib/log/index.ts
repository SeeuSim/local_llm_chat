import { getReasonPhrase, type StatusCodes } from 'http-status-codes';
import type { NextApiRequest } from 'next';
import { NextRequest } from 'next/server';
import pinoLogger, { type Logger } from 'pino';

interface IRequestFields {
	url?: string;
	method?: string;
	referrer?: string;
}

interface IErrorFields extends Error {
	status?: string;
	msg?: string;
	code: StatusCodes;
}

type IErrorFieldsForLog = Pick<IErrorFields, 'status' | 'msg' | 'code'>;

export const getLogger = (req?: NextApiRequest) => {
	const logger: Logger = pinoLogger({
		mixin: (_context) => {
			return { req, env: process.env.VAR_ONE };
		},
		formatters: {
			level: (label) => {
				return { level: label.toUpperCase() };
			},
		},
		level: 'info',
		browser: {
			write: (_p) => {
				const base = JSON.parse(JSON.stringify(_p));
				base['level'] = pinoLogger.levels.labels[base['level']].toUpperCase();
				base['env'] = process.env.VAR_ONE;
				console.log(JSON.stringify(base));
			},
			serialize: true,
		},
		timestamp: pinoLogger.stdTimeFunctions.isoTime,
		base: undefined, // exclude PID, hostname
		serializers: {
			// user: (_user: ServerUser) => {
			//   return {
			//     email: _user.email,
			//     otherProperty: _user.property
			//   }
			// },
			req: (_req: NextRequest | NextApiRequest): IRequestFields => {
				return {
					method: _req.method,
					url:
						_req instanceof NextRequest
							? _req.url?.substring(_req.url?.lastIndexOf('/'))
							: _req.url,
					referrer: _req instanceof NextRequest ? undefined : _req.headers.referer,
				};
			},
			error: (_err: IErrorFields): IErrorFieldsForLog => {
				return {
					status: getReasonPhrase(_err.code),
					code: _err.code,
					msg: _err.message,
				};
			},
		},
	});

	return logger;
};
