import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiServiceUnavailableResponse } from '@nestjs/swagger';

export const ApiCheck = () =>
  applyDecorators(
    ApiOperation({
      summary: '애플리케이션 상태 확인',
      description: '애플리케이션과 데이터베이스의 상태를 확인합니다.',
    }),
    ApiOkResponse({
      description: '상태 확인 성공',
      schema: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            description: '전체 상태',
          },
          info: {
            type: 'object',
            properties: {
              database: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                  },
                },
              },
              redis: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                  },
                },
              },
            },
          },
          error: {
            type: 'object',
            example: {},
          },
          details: {
            type: 'object',
            properties: {
              database: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                  },
                },
              },
              redis: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    }),
    ApiServiceUnavailableResponse({
      description: '서비스를 사용할 수 없음 (데이터베이스 연결 실패)',
      schema: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
          },
          info: {
            type: 'object',
          },
          error: {
            type: 'object',
            properties: {
              database: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                  },
                },
              },
            },
          },
          details: {
            type: 'object',
            properties: {
              database: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                  },
                },
              },
              redis: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    }),
  );
