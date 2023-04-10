const User = require('../models/user');

const   USER_TABLE = 'users',
        ORGANIZATION_TABLE = 'organization',
        jwt = require('jsonwebtoken'),
        {secret_refresh} = require('../config'),      
        {validationResult} = require('express-validator'),
        {CustomError, errorReplier} = require('../models/error'),
        Organization = require('../models/organization');

class OrganizationController{

    async getOrgs(req,res){
        try{
            const organization = new Organization(ORGANIZATION_TABLE);
            const pawns = await organization.getAll(req.params.page,8);
            res.json(pawns)
        } catch(e){
            e.addMessage = 'Get organizations';
            errorReplier(e, res);
            }
    }
    async getOrgsByUserId(req,res){
        try{
            const user = new User(USER_TABLE);
            const pawns = await user.getAllOrganizationsByUserId(req.params.userId);
            res.json(pawns)
        } catch(e){
            e.addMessage = 'Get organizations';
            errorReplier(e, res);
            }
    }
    async getOrgById(req,res){
        try{
            const organization = new Organization(ORGANIZATION_TABLE);
            const result = await organization.getById(req.params.id);
            res.json(result);

        } catch(e){
            e.addMessage= 'Get organization by id';
            errorReplier(e,res);
        }
    }
    async createOrg(req,res){
        try{
            const errors = validationResult(req);
            if(! errors.isEmpty()){
                throw new CustomError(10);
            }
            const { title, description, location,seat,price} = req.body;
            const organization = new Organization(ORGANIZATION_TABLE);
            const {refreshToken} = req.cookies;
            const userId = getJwtUserId(refreshToken);
            if(!userId) throw new CustomError(1007);
            const organizationData= {
                admin_id: userId,
                title: title,
                description: description,
                location: location,
                // seat:seat,
                // price:price
            }
            const [pawn] = await organization.set(organizationData);
            console.log(pawn);
            return res.json({organizationData});

        }catch(e){
            e.addMessage = 'Create organization';
            errorReplier(e,res);
        }
    }
    async editOrg(req,res){
        try{
            const errors = validationResult(req);
            if(! errors.isEmpty()){
                throw new CustomError(10);
            }
            const { title, description, location} = req.body;
            const {refreshToken} = req.cookies;
            const userId = getJwtUserId(refreshToken);
            const organization = new Organization(ORGANIZATION_TABLE);
            const old_pawn = await organization.getById(req.params.id);
            if (!old_pawn) throw new CustomError(1006);
            else if (userId != old_pawn.admin_id) throw new CustomError(1008);
            const newOrganization = await organization.set({
                id: req.params.id, 
                title: title, 
                description: description, 
                location: location
            })
            res.json(newOrganization);
        } catch(e){
            e.addMessage = 'Edit organization';
            errorReplier(e, res);
        }
    } 
    async deleteOrg(req,res){
        try{
            const organization = new Organization(ORGANIZATION_TABLE);
            const candidate = await organization.getById(req.params.id);
            const {refreshToken} = req.cookies;
            const userId = getJwtUserId(refreshToken);
            if (!candidate){
                throw new CustomError(1006);
            } else if(userId != candidate.admin_id) throw new CustomError(1007);
            const pawn = await organization.del({id: req.params.id});
            
            res.json(pawn)
        } catch(e){
            e.addMessage = 'Delete organization by id';
            errorReplier(e, res);
        }
    }
    
}
module.exports = new OrganizationController()
function getJwtUserId(token){
    const decodedToken = jwt.verify(token, secret_refresh, { ignoreExpiration: true });
    console.log(decodedToken);
    return decodedToken.id;
}