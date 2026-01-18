import 'package:shift_giving/domain/entities/organization.dart';

abstract class OrganizationRepository {
  Future<List<Organization>> getOrganizations();
  Future<Organization?> getOrganizationById(String id);
}
