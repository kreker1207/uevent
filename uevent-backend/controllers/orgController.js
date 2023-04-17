const User = require('../models/user');

const   USER_TABLE = 'users',
        ORGANIZATION_TABLE = 'organization',
        jwt = require('jsonwebtoken'),
        {secret_refresh} = require('../config'),      
        {validationResult} = require('express-validator'),
        {CustomError, errorReplier} = require('../models/error'),
        { v4: uuidv4 } = require('uuid'),
        Fs = require('fs'),
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
        console.log('--------------------------')
        try{
            const organization = new Organization(ORGANIZATION_TABLE);
            const result = await organization.getById(req.params.id);
            console.log('--------------------------')
            console.log(result)
            console.log('--------------------------')
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
            const { title, description, location, phone_number} = req.body;
            const organization = new Organization(ORGANIZATION_TABLE);
            const {refreshToken} = req.cookies;
            const userId = getJwtUserId(refreshToken);
            if(!userId) throw new CustomError(1007);
            const organizationData= {
                admin_id: userId,
                title: title,
                description: description,
                location: location,
                phone_number
            }
            const [ pawn ] = await organization.set(organizationData);
            console.log(pawn);
            return res.json(pawn);

        }catch(e){
            e.addMessage = 'Create organization';
            errorReplier(e,res);
        }
    }
    async editOrg(req,res){
        try{
            console.log('jopaaaaa')
            const errors = validationResult(req);
            if(! errors.isEmpty()){
                throw new CustomError(10);
            }
            const { title, description, location,phone_number} = req.body;
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
                location: location,
                phone_number
            })
            res.json(newOrganization[0]);
        } catch(e){
            e.addMessage = 'Edit organization';
            errorReplier(e, res);
        }
    } 

    async editAvatar(req, res) {
        try {
            if (!req.user){
                throw new CustomError(1011);
            }
            if (!req.files || Object.keys(req.files).length === 0) {
                throw new CustomError(1012);
            }

            const organization = new Organization(ORGANIZATION_TABLE);
            const org = await organization.getById(req.params.id);
            
            const avatar_name = org.title + '_' + uuidv4() + '.png';
            const avatar_path = './public/organization_pics/';
            
            // input name on front should be like this VVV (avatar)
            const avatar = req.files.avatar;
            avatar.mv(avatar_path + avatar_name, function(err) {
                if (err) return res.status(500).send(err);
            });
            await organization.set({id: org.id, org_pic: avatar_name});

            if(org.org_pic !== 'none.png') {
                Fs.unlinkSync(avatar_path + org.org_pic)
            }
            
            res.send('Success File uploaded!');
        } catch (e) {
            e.addMessage = 'edit org avatar';
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
            const pawn = await organization.deleteOrganizationWithRelatedData(req.params.id);
            
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