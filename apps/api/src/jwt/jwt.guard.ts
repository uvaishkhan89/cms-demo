import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  RequestMethod,
  SetMetadata
} from "@nestjs/common";
import { HttpArgumentsHost } from "@nestjs/common/interfaces";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Observable } from "rxjs";
import { ExtractJwt } from "passport-jwt";
import { Reflector } from "@nestjs/core";
import { JwtPayload } from "../common/types/jwt-payload.type";

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
export const Public = () => SetMetadata('roles', ['PUBLIC']);

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(@Inject(forwardRef(() => JwtService)) private readonly jwt: JwtService, private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx: HttpArgumentsHost = context.switchToHttp();

    const roles = this.reflector.getAllAndMerge<any[]>('roles',[context.getHandler(), context.getClass()]);

    const req: Request & { token: string } = ctx.getRequest();

    let token: string = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if(!token)
    token = ExtractJwt.fromUrlQueryParameter('token')(req);

    if (roles && roles.includes('PUBLIC')) {
      return true;
    }

    if (!token || !roles) {
      throw new HttpException('Unauthorized Access.', 403);
    }

    const { user }: JwtPayload = this.jwt.verify(token);

    if (!user) {
      throw new HttpException("Unauthorized.", 403);
    }

    if (roles.includes(user.roleId) || user.roleId == 1) {
      req.user = user;
      req.token = token;
      const method = req.method;
      if(method == RequestMethod[RequestMethod.POST]) {
        req.body.createdBy = user.id;
      }
      if(method == RequestMethod[RequestMethod.PATCH]) {
        req.body.updatedBy = user.id;
      }
      return true;
      // if(method == RequestMethod[RequestMethod.DELETE]) {
      //   req.body.deletedBy = user.id;
      // }
    }
    throw new HttpException('Unauthorized Access.', 403);
  }
}
