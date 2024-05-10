package xyz.mlhmz.financemanager.controller;

import lombok.AllArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import xyz.mlhmz.financemanager.dtos.MutateSheetDto;
import xyz.mlhmz.financemanager.dtos.QuerySheetDto;
import xyz.mlhmz.financemanager.dtos.SheetStatsDto;
import xyz.mlhmz.financemanager.entities.Sheet;
import xyz.mlhmz.financemanager.mappers.SheetMapper;
import xyz.mlhmz.financemanager.services.SheetService;

import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor
public class SheetController {
    private final SheetService sheetService;
    private final SheetMapper sheetMapper;

    @MutationMapping
    public QuerySheetDto createSheet(@Argument MutateSheetDto payload, @AuthenticationPrincipal Jwt jwt) {
        Sheet sheet = this.sheetMapper.mapMutateSheetDtoToSheet(payload);
        return this.sheetMapper.mapSheetToQuerySheetDto(
                this.sheetService.createSheet(sheet, jwt)
        );
    }

    @QueryMapping
    public List<QuerySheetDto> findAllSheets(@AuthenticationPrincipal Jwt jwt) {
        return this.sheetMapper.mapSheetListToQuerySheetDtoList(
                this.sheetService.findAllSheets(jwt)
        );
    }

    @QueryMapping
    public SheetStatsDto calculateSheetStats(@Argument UUID uuid, @AuthenticationPrincipal Jwt jwt) {
        return new SheetStatsDto(this.sheetService.sumSheetTransactionsByUuidAndUser(uuid, jwt));
    }

    @QueryMapping
    public QuerySheetDto findSheetByUuid(@Argument UUID uuid, @AuthenticationPrincipal Jwt jwt) {
        Sheet sheet = this.sheetService.findSheetByUUID(uuid, jwt);
        return this.sheetMapper.mapSheetToQuerySheetDto(sheet);
    }

    @MutationMapping
    public QuerySheetDto updateSheetByUuid(@Argument UUID uuid,
                                           @Argument MutateSheetDto payload,
                                           @AuthenticationPrincipal Jwt jwt) {
        Sheet sheet = this.sheetMapper.mapMutateSheetDtoToSheet(payload);
        return this.sheetMapper.mapSheetToQuerySheetDto(
                this.sheetService.updateSheet(uuid, sheet, jwt)
        );
    }

    @MutationMapping
    public boolean deleteSheetByUuid(@Argument UUID uuid, @AuthenticationPrincipal Jwt jwt) {
        this.sheetService.deleteSheetByUUID(uuid, jwt);
        return true;
    }
}
