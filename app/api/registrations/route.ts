import { getDb } from '@/db';
import { registrations } from '@/db/schema';
import { z } from 'zod';
const schema=z.object({name:z.string().trim().min(1).max(40),school:z.string().trim().min(1).max(100),studentId:z.string().trim().min(1).max(40),year:z.enum(['2027','2026','2025','2024','2023','其他']),email:z.string().trim().email().max(160),nickname:z.string().trim().max(40).default(''),consent:z.literal('on')});
export async function POST(req:Request){
 const origin=req.headers.get('origin'); if(origin&&origin!==new URL(req.url).origin)return Response.json({error:'请求来源无效'},{status:403});
 if(Number(req.headers.get('content-length')||0)>8192)return Response.json({error:'提交内容过长'},{status:413});
 let raw;try{const body=await req.text();if(body.length>8192)return Response.json({error:'提交内容过长'},{status:413});raw=JSON.parse(body);}catch{return Response.json({error:'信息格式有误，请检查后重试'},{status:400});}
 const parsed=schema.safeParse(raw);if(!parsed.success)return Response.json({error:'请完整填写有效信息，并勾选报名信息使用说明'},{status:400});
 const {consent,...values}=parsed.data;void consent;const id='WH-'+crypto.randomUUID().slice(0,8).toUpperCase();
 try{const [saved]=await getDb().insert(registrations).values({...values,email:values.email.toLowerCase(),id,createdAt:new Date().toISOString()}).onConflictDoNothing({target:[registrations.school,registrations.studentId]}).returning({id:registrations.id});if(!saved)return Response.json({error:'该学校与学号已报名，请勿重复提交'},{status:409});return Response.json({id},{status:201,headers:{'Cache-Control':'no-store'}});}catch{console.error('Registration persistence failed');return Response.json({error:'暂时无法保存报名，请稍后重试'},{status:503});}
}
